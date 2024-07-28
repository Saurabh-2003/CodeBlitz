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

export const handlePythonCode = async (
  userCode: string,
): Promise<ExecutionResult> => {
  createDir();

  const fileName = `script_${Date.now()}.py`;
  const filePath = path.resolve(TEMP_DIR, fileName);

  fs.writeFileSync(filePath, userCode, "utf-8");
  console.log(`File written: ${filePath}`);

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

  try {
    await compilePythonCode(fileName);
  } catch (error) {
    return {
      message: `Compilation Error: ${error}`,
      error: true,
      success: false,
      outputValue: "",
    };
  }

  try {
    const outputValue = await runPythonCode(fileName);
    return handleOutput(outputValue);
  } catch (error) {
    return {
      message: `Execution Error: ${error}`,
      error: true,
      success: false,
      outputValue: "",
    };
  }
};

// Function to compile Python code (syntax check)
const compilePythonCode = (scriptName: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const compileCommand = `docker run --rm -v codeblitz_shared_volume:/code_execution -w /code_execution codeblitz-python_service python -m py_compile ${scriptName}`;

    console.log(`Running compile command: ${compileCommand}`);

    exec(compileCommand, (error, stdout, stderr) => {
      if (error) {
        console.error(`Compilation error: ${stderr}`);
        reject(stderr);
      } else {
        console.log(`Compilation output: ${stdout}`);
        resolve();
      }
    });
  });
};

// Function to run the Python code
const runPythonCode = (scriptName: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const runCommand = `docker run --rm -v codeblitz_shared_volume:/code_execution -w /code_execution codeblitz-python_service python ${scriptName}`;

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
      console.error(`Docker container stderr: ${stderr}`);
    });

    dockerProcess.on("close", (code) => {
      if (code === 0) {
        resolve(outputValue);
      } else {
        reject(`Docker container exited with code ${code}`);
      }
    });

    dockerProcess.on("error", (err) => {
      reject(`Docker error: ${err}`);
    });
  });
};

// Function to handle the output from code execution
const handleOutput = (outputValue: string): ExecutionResult => {
  console.log(`Output: \n${outputValue}`);

  return {
    message: "Code executed",
    outputValue,
    error: false,
    success: true,
  };
};
