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

export const handleCPPCode = async (
  userCode: string,
): Promise<ExecutionResult> => {
  // Check if the volume is mounted correctly
  try {
    const dirCheck = execSync(`ls -la /code_execution`).toString();
    console.log(
      `Volume mounted at /code_execution. Directory contents: \n${dirCheck}`,
    );
  } catch (error) {
    console.error(`Error checking directory contents: ${error}`);
    return {
      message: "Failed to access /code_execution volume",
      outputValue: "",
      error: true,
      success: false,
    };
  }

  createDir();

  const fileName = `main_${Date.now()}.cpp`;
  const outputName = `output_${Date.now()}`;
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
    await compileCPPCode(fileName, outputName);
  } catch (error) {
    return {
      message: `Compilation Error: ${error}`,
      error: true,
      success: false,
      outputValue: "",
    };
  }

  try {
    const outputValue = await runCPPCode(outputName);
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

const compileCPPCode = (
  sourceFileName: string,
  outputName: string,
): Promise<void> => {
  return new Promise((resolve, reject) => {
    const compileCommand = `docker run --rm -v codeblitz_shared_volume:/code_execution -w /code_execution codeblitz-cpp_service g++ ${sourceFileName} -o ${outputName}`;

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

const runCPPCode = (executableName: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const runCommand = `docker run --rm -v codeblitz_shared_volume:/code_execution -w /code_execution codeblitz-cpp_service ./${executableName}`;

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

const handleOutput = (outputValue: string): ExecutionResult => {
  console.log(`Output: \n${outputValue}`);

  return {
    message: "Code executed",
    outputValue,
    error: false,
    success: true,
  };
};
