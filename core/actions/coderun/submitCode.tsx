"use server";

import { db } from "@/core/db/db";
import axios from "axios";
import { exec, spawn } from "child_process";
import fs from "fs";
import path from "path";
import util from "util";
import { v4 as uuidv4 } from "uuid";
type SolutionProps = {
  lang: string;
  code: string;
  problemId: string;
  onlyPartialTests?: boolean;
  userId?: string;
};

enum SubmissionStatus {
  ACCEPTED = "ACCEPTED",
  WRONG_ANSWER = "WRONG_ANSWER",
  TIME_LIMIT_EXCEEDED = "TIME_LIMIT_EXCEEDED",
  RUNTIME_ERROR = "RUNTIME_ERROR",
  COMPILE_ERROR = "COMPILE_ERROR",
}

const execPromise = util.promisify(exec);

// Helper function to get problem based on language
const getProblemData = async (problemId: string, lang: string) => {
  const fieldMapping: { [key: string]: string } = {
    python: "pythonDriver",
    cpp: "cppDriver",
    javascript: "jsDriver",
  };

  const selectFields = {
    inputs: true,
    outputs: true,
    [fieldMapping[lang]]: true,
    difficulty: true, // Include difficulty
  };

  const problem = await db.problem.findUnique({
    where: { id: problemId },
    select: selectFields,
  });

  if (!problem) {
    throw new Error("Problem not found.");
  }

  return problem;
};

// Function to lint JavaScript code using ESLint in the Docker container
const compileJSCode = (scriptName: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const scriptPath = path.basename(scriptName);

    // Use the path inside the container
    const containerScriptPath = `/tmp/${scriptPath}`;
    const lintCommand = `npx eslint ${containerScriptPath} `;

    const dockerCommand = `docker run --rm -v /tmp:/tmp -w /tmp js_service sh -c "${lintCommand}"`;

    console.log(`Running Docker lint command: ${dockerCommand}`);

    const lintProcess = spawn(dockerCommand, {
      shell: true,
    });

    let lintingError = "";

    lintProcess.stdout.on("data", (data) => {
      console.log(`Linting output: ${data.toString()}`);
    });

    lintProcess.stderr.on("data", (data) => {
      console.error(`Linting error: ${data.toString()}`);
      lintingError += data.toString();
    });

    lintProcess.on("close", (code) => {
      if (code === 0) {
        console.log("Linting successful.");
        resolve();
      } else {
        console.error(`Linting failed with code ${code}`);
        reject(`Linting Error: ${lintingError}`);
      }
    });
  });
};

const compilePythonCode = (scriptName: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    // Command to check Python syntax
    const compileCommand = `python -m py_compile ${path.basename(scriptName)}`;
    const dockerCommand = `docker run --rm -v /tmp:/tmp -w /tmp python_service sh -c "${compileCommand}"`;

    console.log(`Running Docker compile command: ${dockerCommand}`);

    const compileProcess = spawn(dockerCommand, {
      shell: true,
    });

    let compilationError = "";

    compileProcess.stderr.on("data", (data) => {
      console.error(`Compilation error: ${data.toString()}`);
      compilationError += data.toString();
    });

    compileProcess.on("close", (code) => {
      if (code === 0) {
        console.log("Compilation successful.");
        resolve();
      } else {
        console.error(`Compilation failed with code ${code}`);
        reject(`Compilation Error: ${compilationError}`);
      }
    });
  });
};
const compileCPPCode = (
  sourceFileName: string,
  outputName: string,
): Promise<void> => {
  return new Promise((resolve, reject) => {
    const compileCommand = `g++ ${path.basename(sourceFileName)} -o ${path.basename(outputName)}`;
    const dockerCommand = `docker run --rm -v /tmp:/tmp -w /tmp cpp_service sh -c "${compileCommand}"`;

    console.log(`Running Docker compile command: ${dockerCommand}`);

    const compileProcess = spawn(dockerCommand, {
      shell: true,
    });

    let compilationError = "";

    compileProcess.stderr.on("data", (data) => {
      console.error(`Compilation error: ${data.toString()}`);
      compilationError += data.toString();
    });

    compileProcess.on("close", (code) => {
      if (code === 0) {
        console.log("Compilation successful.");
        resolve();
      } else {
        console.error(`Compilation failed with code ${code}`);
        reject(`Compilation Error: ${compilationError}`);
      }
    });
    compileJSCode;
  });
};
const runCodeInDocker = async (
  lang: string,
  codeFileName: string,
  inputFileName: string,
  outputFileName: string,
) => {
  const langSpecificCommands: { [key: string]: string } = {
    python: `python3 ${path.basename(codeFileName)} < ${path.basename(inputFileName)} > ${path.basename(outputFileName)} && cat ${path.basename(outputFileName)}`,
    cpp: `g++ ${path.basename(codeFileName)} -o /tmp/output && /tmp/output < ${path.basename(inputFileName)} > ${path.basename(outputFileName)} && cat ${path.basename(outputFileName)}`,
    javascript: `node ${path.basename(codeFileName)} < ${path.basename(inputFileName)} > ${path.basename(outputFileName)} && cat ${path.basename(outputFileName)}`,
  };

  if (!langSpecificCommands[lang]) {
    throw new Error(`Unsupported language: ${lang}`);
  }

  const runCommand = `docker run --rm -v /tmp:/tmp -w /tmp ${lang}_service sh -c '${langSpecificCommands[lang]}'`;

  console.log("Run Command:", runCommand); // For debugging

  const { stdout: runOut, stderr: runErr } = await execPromise(runCommand);
  if (runErr) {
    throw new Error(`Runtime Error: ${runErr}`);
  }

  return runOut;
};

const submitAllCode = async (solution: SolutionProps) => {
  try {
    const { lang, code, problemId, onlyPartialTests, userId } = solution;

    if (!userId) {
      throw new Error("User ID is required.");
    }

    // Fetch problem data
    const problem = await getProblemData(problemId, lang);

    // Generate unique filenames
    const basePath = "/tmp";
    const codeFileName = path.join(
      basePath,
      `code_${uuidv4()}.${lang === "cpp" ? "cpp" : lang}`,
    );
    const inputFileName = path.join(basePath, `input_${uuidv4()}.txt`);
    const expectedOutputFileName = path.join(
      basePath,
      `expected_output_${uuidv4()}.txt`,
    );
    const outputFileName = path.join(basePath, `output_${uuidv4()}.txt`);

    // Write the code to a file
    fs.writeFileSync(codeFileName, code);

    // Compile the code if necessary

    if (lang === "javascript") {
      try {
        await compileJSCode(codeFileName);
      } catch (lintingError) {
        return {
          success: "error",
          error: lintingError,
          message: "Compilation Error",
        };
      }
    } else if (lang === "python") {
      try {
        await compilePythonCode(codeFileName);
      } catch (compilationError) {
        return {
          success: "error",
          error: compilationError,
          message: "Compilation Error",
        };
      }
    } else if (lang === "cpp") {
      try {
        await compileCPPCode(codeFileName, "/tmp/output");
      } catch (compilationError) {
        return {
          success: "error",
          error: compilationError,
          message: "Compilation Error",
        };
      }
    }

    // Download input and output files
    const [inputResponse, outputResponse] = await Promise.all([
      axios.get(problem.inputs, { responseType: "arraybuffer" }),
      axios.get(problem.outputs, { responseType: "arraybuffer" }),
    ]);

    fs.writeFileSync(inputFileName, inputResponse.data);
    fs.writeFileSync(expectedOutputFileName, outputResponse.data);

    // Run code in Docker
    const runOut = await runCodeInDocker(
      lang,
      codeFileName,
      inputFileName,
      outputFileName,
    );

    // Process output and expected output
    const output = runOut.trim().split("\n");
    const expectedOutput = fs
      .readFileSync(expectedOutputFileName, "utf-8")
      .trim()
      .split("\n");

    const inputLines = inputResponse.data.toString().trim().split("\n");

    const testInputs = onlyPartialTests ? inputLines.slice(0, 3) : inputLines;
    const testOutputs = expectedOutput.slice(0, testInputs.length);

    const results = testInputs.map((input, index) => {
      const result = output[index] || "";
      const expected = testOutputs[index] || "";
      const isSuccess = result === expected;

      return {
        input,
        expectedOutput: expected,
        output: result,
        result: isSuccess
          ? { status: "success", message: "Test Case Passed." }
          : {
              status: "failure",
              message: `Test Case Failed: Expected ${expected} but got ${result}`,
            },
      };
    });

    const totalTestCases = results.length;
    const completedTestCases = results.filter(
      (r) => r.result.status === "success",
    ).length;
    const statusToSave =
      completedTestCases === totalTestCases
        ? SubmissionStatus.ACCEPTED
        : SubmissionStatus.WRONG_ANSWER;

    // Check for existing accepted submissions
    const existingSubmission = await db.submission.findFirst({
      where: {
        problemId,
        status: SubmissionStatus.ACCEPTED,
        userId,
      },
    });

    // Save submission if all tests are completed
    if (!onlyPartialTests) {
      await db.submission.create({
        data: {
          code,
          status: statusToSave,
          userId,
          problemId,
        },
      });

      // Update user stats only if no existing accepted submission
      if (!existingSubmission) {
        const problemDifficulty = problem.difficulty;
        const updateFields: { [key: string]: any } = {
          easySolved: 0,
          mediumSolved: 0,
          hardSolved: 0,
        };

        if (statusToSave === SubmissionStatus.ACCEPTED) {
          switch (problemDifficulty) {
            case "EASY":
              updateFields.easySolved = 1;
              break;
            case "MEDIUM":
              updateFields.mediumSolved = 1;
              break;
            case "HARD":
              updateFields.hardSolved = 1;
              break;
          }
          await db.user.update({
            where: { id: userId },
            data: {
              [problemDifficulty.toLowerCase() + "Solved"]: {
                increment: 1,
              },
            },
          });
        }
      }
    }

    return {
      language: lang,
      codeSnippet: code,
      associatedProblem: problemId,
      totalTestCases,
      completedTestCases,
      results,
      partialExecution: onlyPartialTests || false,
      status: completedTestCases === totalTestCases ? "success" : "failure",
      message:
        completedTestCases === totalTestCases
          ? "All Test Cases Passed"
          : "Wrong Answer",
      submittedAt: Date.now(),
    };
  } catch (error: any) {
    return {
      success: "error",
      error: error.message || "Unknown error occurred",
    };
  }
};

export default submitAllCode;
