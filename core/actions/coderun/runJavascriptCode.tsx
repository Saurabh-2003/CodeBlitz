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

export const handleJavaScriptCode = async (userCode: string) => {
  createDir();

  const fileName = `script_${Date.now()}.js`; // Unique filename to avoid overwriting
  const filePath = path.resolve(TEMP_DIR, fileName);
  fs.writeFileSync(filePath, userCode, "utf-8");

  const runCommand = `sudo docker run --rm -i -v ${TEMP_DIR}:/code codeblitz-js_service  node ${fileName}`;

  try {
    const outputValue = await runJavaScriptCode(runCommand);
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

const runJavaScriptCode = (runCommand: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const nodeProcess = spawn(runCommand, {
      shell: true,
      stdio: ["pipe", "pipe", "pipe"],
    });

    let outputValue = "";

    nodeProcess.stdout.on("data", (data) => {
      outputValue += data.toString();
    });

    nodeProcess.stderr.on("data", (stderr) => {
      console.error(`Docker container stderr: ${stderr}`);
    });

    nodeProcess.on("close", (code) => {
      if (code === 0) {
        resolve(outputValue);
      } else {
        reject(`Docker container exited with code ${code}`);
      }
    });

    nodeProcess.on("error", (err) => {
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
