"use server";
import { exec, execSync, spawn } from "child_process";
import fs from "fs";
import path from "path";

const TEMP_DIR = "/code_execution";

const createDir = (): void => {
  if (!fs.existsSync(TEMP_DIR)) {
    fs.mkdirSync(TEMP_DIR, { recursive: true });
  }
};

interface ExecutionResult {
  message: string;
  outputValue: string;
  error: boolean;
  success: boolean;
}

export const handleJSCode = async (
  userCode: string,
): Promise<ExecutionResult> => {
  createDir();

  const fileName = `script_${Date.now()}.js`;
  const filePath = path.resolve(TEMP_DIR, fileName);

  // Write the file using execSync
  try {
    execSync(`echo "${userCode.replace(/"/g, '\\"')}" > ${filePath}`);
    console.log(`File written: ${filePath}`);
  } catch (error) {
    console.error(`Error writing file: ${error}`);
    return {
      message: `File Write Error: ${error}`,
      error: true,
      success: false,
      outputValue: "",
    };
  }

  await new Promise((resolve) => setTimeout(resolve, 100)); // 100 ms delay

  try {
    fs.accessSync(filePath, fs.constants.R_OK);
    console.log(`${fileName} is accessible`);
  } catch (err) {
    console.error(`File not accessible: ${err}`);
  }

  try {
    const dirContents = execSync(`ls -la ${TEMP_DIR}`).toString();
    console.log(`Directory contents after file write: \n${dirContents}`);
  } catch (error) {
    console.error(`Error listing directory contents: ${error}`);
  }

  // Lint the JavaScript code
  try {
    await lintJSCode(fileName);
  } catch (error) {
    return {
      message: `Linting Error: ${error}`,
      error: true,
      success: false,
      outputValue: "",
    };
  }

  // Run the JavaScript code
  try {
    const outputValue = await runJSCode(fileName);
    return handleOutput(outputValue, true);
  } catch (error) {
    return {
      message: `Execution Error: ${error}`,
      error: true,
      success: false,
      outputValue: "",
    };
  }
};

const lintJSCode = (scriptName: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const lintCommand = `docker run --rm  -v codeblitz_shared_volume:/code_execution/external -w /code_execution codeblitz-js_service eslint external/${scriptName}`;
    console.log(`Running linting command: ${lintCommand}`);

    exec(lintCommand, (error, stdout, stderr) => {
      if (error) {
        console.error(`Linting error: ${stderr}`);
        reject(stderr);
      } else {
        console.log(`Linting output: ${stdout}`);
        resolve();
      }
    });
  });
};

// Function to run the JavaScript code
const runJSCode = (scriptName: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const runCommand = `docker run --rm  -v codeblitz_shared_volume:/code_execution/external -w /code_execution codeblitz-js_service node external/${scriptName}`;

    console.log(`Running execution command: ${runCommand}`);

    const dockerProcess = spawn(runCommand, {
      shell: true,
      stdio: ["pipe", "pipe", "pipe"],
    });

    let outputValue = "";

    dockerProcess.stdout.on("data", (data) => {
      outputValue += data.toString();
    });

    dockerProcess.stderr.on("data", (stderr) => {
      console.error(`Execution stderr: ${stderr}`);
      reject(`Compilation : ${stderr}`);
    });

    dockerProcess.on("close", (code) => {
      if (code === 0) {
        resolve(outputValue);
      } else {
        reject(`Execution process exited with code ${code}`);
      }
    });

    dockerProcess.on("error", (err) => {
      reject(`Execution error: ${err}`);
    });
  });
};

// Function to handle the output from code execution
const handleOutput = (outputValue: string, error: boolean): ExecutionResult => {
  console.log(`Output: \n${outputValue}`);

  return {
    message: "Code executed",
    outputValue,
    error: false,
    success: true,
  };
};
