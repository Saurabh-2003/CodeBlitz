"use server";
import { spawn } from "child_process";
import fs from "fs";
import os from "os";
import path from "path";

const TEMP_DIR = path.join(os.tmpdir(), "code_execution");
const createDir = () => {
  if (!fs.existsSync(TEMP_DIR)) {
    fs.mkdirSync(TEMP_DIR, { recursive: true });
  }
};

export const handleCPPCode = async (userCode: string) => {
  createDir();

  const fileName = `main_${Date.now()}.cpp`; // Unique filename to avoid overwriting
  const filePath = path.resolve(TEMP_DIR, fileName);
  fs.writeFileSync(filePath, userCode, "utf-8");

  const compileCommand = `sudo docker run --rm -v ${TEMP_DIR}:/code -w /code codeblitz-cpp_service g++ ${fileName} -o main`;

  try {
    await compileCode(compileCommand);
    const outputValue = await runCPPCode();
    return handleOutput(outputValue);
  } catch (error) {
    return {
      message: `Error: ${error}`,
      error: true,
      success: false,
      outputValue: "",
    };
  }
};

const compileCode = (compileCommand: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const compileProcess = spawn(compileCommand, { shell: true });
    let compilationError = "";

    compileProcess.stderr.on("data", (data) => {
      compilationError += data.toString();
    });

    compileProcess.on("close", (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(`Compilation failed with code ${code}: ${compilationError}`);
      }
    });
  });
};

const runCPPCode = (): Promise<string> => {
  return new Promise((resolve, reject) => {
    const outputFilePath = path.join(TEMP_DIR, "output.txt"); // Define output file path

    const runCommand = `sudo docker run --rm -i -v ${TEMP_DIR}:/code codeblitz-cpp_service ./main`;

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

const handleOutput = (outputValue: string) => {
  console.log(`Output: \n${outputValue}`);

  return {
    message: "Code executed",
    outputValue,
    error: false,
    success: true,
  };
};
