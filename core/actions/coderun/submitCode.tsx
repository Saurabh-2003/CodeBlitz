"use server";

import { db } from "@/core/db/db";
import axios from "axios";
import { exec } from "child_process";
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
    javascript: "jsDriver", // Assuming you have a field for JS driver
  };

  const selectFields = {
    inputs: true,
    outputs: true,
    [fieldMapping[lang]]: true,
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

  // Execute the command and capture output
  const { stdout: runOut, stderr: runErr } = await execPromise(runCommand);
  if (runErr) {
    throw new Error(`Runtime Error: ${runErr}`);
  }

  return runOut;
};

const submitAllCode = async (solution: SolutionProps) => {
  try {
    const { lang, code, problemId, onlyPartialTests, userId } = solution;

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

    // Split the input data into test cases
    const inputLines = inputResponse.data.toString().trim().split("\n");

    // Handle partial tests if necessary
    const testInputs = onlyPartialTests ? inputLines.slice(0, 3) : inputLines;
    const testOutputs = expectedOutput.slice(0, testInputs.length);

    // Compare outputs
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

    // Aggregate results
    const totalTestCases = results.length;
    const completedTestCases = results.filter(
      (r) => r.result.status === "success",
    ).length;
    const statusToSave =
      completedTestCases === totalTestCases
        ? SubmissionStatus.ACCEPTED
        : SubmissionStatus.WRONG_ANSWER;

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
