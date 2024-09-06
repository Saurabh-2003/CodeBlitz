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

const submitCppCode = async (solution: SolutionProps) => {
  try {
    const { lang, code, problemId, onlyPartialTests, userId } = solution;

    // Fetch problem data
    const problem = await db.problem.findUnique({
      where: { id: problemId },
      select: { cppDriver: true, inputs: true, outputs: true },
    });

    if (!problem) {
      throw new Error("Problem not found.");
    }

    // Generate unique filenames for the code, input, and output files
    const basePath = "/tmp";
    const codeFileName = path.join(basePath, `code_${uuidv4()}.cpp`);
    const inputFileName = path.join(basePath, `input_${uuidv4()}.txt`);
    const expectedOutputFileName = path.join(
      basePath,
      `expected_output_${uuidv4()}.txt`,
    );
    const outputFileName = path.join(basePath, `output_${uuidv4()}.txt`);

    // Write the C++ code to a file
    fs.writeFileSync(codeFileName, code);

    // Download input and output files using axios
    const [inputResponse, outputResponse] = await Promise.all([
      axios.get(problem.inputs, { responseType: "arraybuffer" }),
      axios.get(problem.outputs, { responseType: "arraybuffer" }),
    ]);

    fs.writeFileSync(inputFileName, inputResponse.data);
    fs.writeFileSync(expectedOutputFileName, outputResponse.data);

    if (lang !== "cpp") {
      throw new Error("Unsupported language. Only C++ is supported for now.");
    }

    // Compilation step
    const compileCommand = `docker run --rm -v ${basePath}:${basePath} -w ${basePath} cpp_service sh -c 'g++ ${path.basename(
      codeFileName,
    )} -o /tmp/output'`;

    console.log("Compile Command:", compileCommand); // For debugging

    // Execute the compilation
    const { stderr: compileErr } = await execPromise(compileCommand);

    // If there's a compilation error, return it
    if (compileErr) {
      throw new Error(`Compilation Error: ${compileErr}`);
    }

    // Run the compiled code using Docker and pass the input file
    const runCommand = `docker run --rm -v ${basePath}:${basePath} -w ${basePath} cpp_service sh -c '
      /tmp/output < ${path.basename(inputFileName)} > ${path.basename(outputFileName)} && \
      cat ${path.basename(outputFileName)}
    '`;

    console.log("Run Command:", runCommand); // For debugging

    // Execute the command to run the compiled program
    const { stdout: runOut, stderr: runErr } = await execPromise(runCommand);
    if (runErr) {
      throw new Error(`Runtime Error: ${runErr}`);
    }

    // Read and process the output
    const output = fs.readFileSync(outputFileName, "utf-8").trim().split("\n");

    // Read expected output
    const expectedOutput = fs
      .readFileSync(expectedOutputFileName, "utf-8")
      .trim()
      .split("\n");

    // Split the input data into test cases
    const inputLines = inputResponse.data.toString().trim().split("\n");

    // If partial tests are enabled, use only the first 3 inputs
    const testInputs = onlyPartialTests ? inputLines.slice(0, 3) : inputLines;

    // Ensure the expected output lines match the number of test cases
    const testOutputs = expectedOutput.slice(0, testInputs.length);

    // Compare outputs with expected outputs
    const results = testInputs.map((input, index) => {
      const result = output[index] || "";
      const expected = testOutputs[index] || "";
      const isSuccess = result === expected;

      return {
        input: input,
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

    // Aggregate the results
    const totalTestCases = results.length;
    const completedTestCases = results.filter(
      (result) => result.result.status === "success",
    ).length;

    const overallResult = {
      status: completedTestCases === totalTestCases ? "success" : "failure",
      message:
        completedTestCases === totalTestCases
          ? onlyPartialTests
            ? "Sample Test Cases Passed"
            : "All Test Cases Passed"
          : "Wrong Answer",
      failedCases:
        completedTestCases === totalTestCases
          ? undefined
          : results.filter((result) => result.result.status === "failure"),
    };

    // // Clean up temporary files
    // fs.unlinkSync(codeFileName);
    // fs.unlinkSync(inputFileName);
    // fs.unlinkSync(expectedOutputFileName);
    // fs.unlinkSync(outputFileName);

    // Return the result, indicating partial execution if applicable
    //
    const statusToSave =
      completedTestCases === totalTestCases
        ? SubmissionStatus.ACCEPTED
        : SubmissionStatus.WRONG_ANSWER;
    if (!onlyPartialTests) {
      console.log(userId);
      await db.submission.create({
        data: {
          code,
          status: statusToSave,
          userId: userId,
          problemId: problemId,
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
      ...overallResult,
      submittedAt: Date.now(),
    };
  } catch (error: any) {
    return {
      success: "error",
      error: error.message || "Unknown error occurred",
    };
  }
};

export default submitCppCode;
