"use server";
import { execSync, spawn } from "child_process";
import fs from "fs";
import path from "path";

// Use the volume mount point specified in docker-compose.yml
const TEMP_DIR = "/code_execution"; // This is the path inside the container

// Ensure directory exists (this should match the container mount point)
const createDir = () => {
  if (!fs.existsSync(TEMP_DIR)) {
    fs.mkdirSync(TEMP_DIR, { recursive: true });
  }
};

export const handleCPPCode = async (userCode: string) => {
  createDir();

  const fileName = `main_${Date.now()}.cpp`;
  const filePath = path.resolve(TEMP_DIR, fileName);
  fs.writeFileSync(filePath, userCode, "utf-8");

  // Log directory contents
  try {
    const dirContents = execSync(`ls -la ${TEMP_DIR}`).toString();
    console.log(`Directory contents:\n${dirContents}`);
  } catch (error) {
    console.error(`Error listing directory contents: ${error}`);
  }

  const compileCommand = `docker run --rm -v codeblitz_temp_dir:/code_execution -w /code_execution codeblitz-cpp_service g++ ${fileName} -o main`;

  try {
    const outputValue = await runCPPCode(compileCommand);
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

const runCPPCode = (compileCommand: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const runCommand = `docker run --rm -v codeblitz_temp_dir:/code_execution -w /code_execution codeblitz-cpp_service ./main`;

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
