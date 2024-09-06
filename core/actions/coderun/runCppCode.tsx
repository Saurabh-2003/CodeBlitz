"use server";
import { exec, execSync, spawn } from "child_process";
import fs from "fs";
import path from "path";
import readline from "readline";
import { Transform } from "stream";

const TEMP_DIR = "/code_execution";
const outputFileName = `output_${Date.now()}.txt`;
const outputFilePath = path.resolve(TEMP_DIR, outputFileName);
const inputFileName = `input_${Date.now()}.txt`;
const inputFilePath = path.resolve(TEMP_DIR, inputFileName);

const createDir = (): void => {
  if (!fs.existsSync(TEMP_DIR)) {
    fs.mkdirSync(TEMP_DIR, { recursive: true });
  }
};

interface ExecutionResult {
  message: string;
  outputValue: string;
  diff: Array<{}>;
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
      diff: [],
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
      diff: [],
      error: true,
      success: false,
      outputValue: "",
    };
  }

  try {
    const outputValue = await runCPPCode(outputName);

    //const expectoutput = "4 3 2 1\n/r\n5 4 3 2\n/r\n7 6 5 3 4\n/r\n";
    const expectoutput = `3\n/r\n1\n/r\n3\n/r\n6\n/r\n2\n/r\n3\n/r\n3\n/r\n1\n/r\n9\n/r\n`;
    const expectedoutputFileName = `expectedOutput_${Date.now()}.txt`;
    const expectedOutputFilePath = path.resolve(
      TEMP_DIR,
      expectedoutputFileName,
    );
    fs.writeFileSync(expectedOutputFilePath, expectoutput, "utf-8");
    const diff = await compareTestCasesStream(
      outputFilePath,
      expectedOutputFilePath,
      inputFilePath,
    );

    return handleOutput(outputValue, diff);
  } catch (error) {
    return {
      message: `Execution Error: ${error}`,
      error: true,
      diff: [],
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
    const runCommand = `docker run --rm -i -v codeblitz_shared_volume:/code_execution -w /code_execution codeblitz-cpp_service ./${executableName}`;

    console.log(`Running execution command: ${runCommand}`);

    const dockerProcess = spawn(runCommand, {
      shell: true,
      stdio: ["pipe", "pipe", "pipe"],
    });

    const customInput = `9\n/r\nabcab cbb\n/r\nbbbbb\n/r\npwwkew\n/r\nabcdef\n/r\naabbcc\n/r\ndvdf\n/r\nanviaj\n/r\naa\n/r\ntmmzuxt\n/r\n`;

    const removeCarriageReturn = new Transform({
      transform(chunk, encoding, callback) {
        // Convert buffer to string, replace \r, and push result
        this.push(chunk.toString().replace(/\/r/g, ""));
        callback();
      },
    });

    fs.writeFileSync(inputFilePath, customInput, "utf-8");

    const inputStream = fs.createReadStream(inputFilePath);
    const outputStream = fs.createWriteStream(outputFilePath);

    inputStream.pipe(removeCarriageReturn).pipe(dockerProcess.stdin);

    let outputValue = "";
    dockerProcess.stdout.pipe(outputStream);

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

const handleOutput = (
  outputValue: string,
  diff: Array<{
    testCaseNumber: number;
    input: string;
    output: string;
    expectedOutput: string;
  }>,
): ExecutionResult => {
  console.log(`Output: \n${outputValue}`);
  console.log(`diff`, diff);
  return {
    message: "Code executed",
    outputValue,
    diff,
    error: false,
    success: true,
  };
};

async function compareTestCasesStream(
  file1Path: string,
  file2Path: string,
  inputFilePath: string,
  delimiter: string = "/r",
): Promise<
  Array<{
    testCaseNumber: number;
    input: string;
    output: string;
    expectedOutput: string;
  }>
> {
  return new Promise((resolve, reject) => {
    const fileStream1 = fs.createReadStream(file1Path, { encoding: "utf8" });
    const fileStream2 = fs.createReadStream(file2Path, { encoding: "utf8" });
    const inputStream = fs.createReadStream(inputFilePath, {
      encoding: "utf8",
    });

    let currentTestCase1 = "";
    let currentTestCase2 = "";
    let currentInput = "";
    let testCaseNumber = 0;
    let differences: Array<{
      testCaseNumber: number;
      input: string;
      output: string;
      expectedOutput: string;
    }> = [];
    let buffer1 = "";
    let buffer2 = "";
    let inputBuffer = "";

    let lineCounter = 0;

    // Create readline interface for input file
    const rl = readline.createInterface({
      input: inputStream,
      crlfDelay: Infinity,
    });

    // Skip the first two lines
    rl.on("line", (line) => {
      if (lineCounter < 2) {
        lineCounter++;
      } else {
        inputBuffer += line + "\n"; // Rebuild the inputBuffer with remaining lines
      }
    });

    fileStream1.on("data", (chunk1) => {
      buffer1 += chunk1;
    });

    fileStream2.on("data", (chunk2) => {
      buffer2 += chunk2;
    });
    processChunks();
    fileStream1.on("end", () => {
      if (buffer2 || inputBuffer) {
        processChunks(true); // Process remaining data
      }
    });

    fileStream2.on("end", () => {
      if (buffer1 || inputBuffer) {
        processChunks(true); // Process remaining data
      }
    });

    inputStream.on("end", () => {
      processChunks(true); // Process remaining data
    });

    fileStream1.on("error", reject);
    fileStream2.on("error", reject);
    inputStream.on("error", reject);

    function processChunks(endOfStream = false) {
      let index1 = buffer1.indexOf(delimiter);
      let index2 = buffer2.indexOf(delimiter);
      let indexInput = inputBuffer.indexOf(delimiter);
      while (index1 !== -1 || index2 !== -1 || indexInput !== -1) {
        if (index1 !== -1 && index2 !== -1 && indexInput !== -1) {
          currentTestCase1 = buffer1.substring(0, index1);
          currentTestCase2 = buffer2.substring(0, index2);
          currentInput = inputBuffer.substring(0, indexInput);

          if (currentTestCase1 !== currentTestCase2) {
            differences.push({
              testCaseNumber: testCaseNumber + 1,
              input: currentInput,
              output: currentTestCase1,
              expectedOutput: currentTestCase2,
            });
          }

          buffer1 = buffer1.substring(index1 + delimiter.length);
          buffer2 = buffer2.substring(index2 + delimiter.length);
          inputBuffer = inputBuffer.substring(indexInput + delimiter.length);
          testCaseNumber++;
        } else if (index1 !== -1) {
          currentTestCase1 = buffer1.substring(0, index1);
          differences.push({
            testCaseNumber: testCaseNumber + 1,
            input: inputBuffer,
            output: currentTestCase1,
            expectedOutput: buffer2,
          });
          buffer1 = buffer1.substring(index1 + delimiter.length);
          testCaseNumber++;
        } else if (index2 !== -1) {
          currentTestCase2 = buffer2.substring(0, index2);
          differences.push({
            testCaseNumber: testCaseNumber + 1,
            input: inputBuffer,
            output: buffer1,
            expectedOutput: currentTestCase2,
          });
          buffer2 = buffer2.substring(index2 + delimiter.length);
          testCaseNumber++;
        } else if (indexInput !== -1) {
          currentInput = inputBuffer.substring(0, indexInput);
          differences.push({
            testCaseNumber: testCaseNumber + 1,
            input: currentInput,
            output: buffer1,
            expectedOutput: buffer2,
          });
          inputBuffer = inputBuffer.substring(indexInput + delimiter.length);
          testCaseNumber++;
        }

        index1 = buffer1.indexOf(delimiter);
        index2 = buffer2.indexOf(delimiter);
        indexInput = inputBuffer.indexOf(delimiter);
      }

      if (endOfStream && buffer1 && buffer2 && inputBuffer) {
        if (buffer1 !== buffer2) {
          differences.push({
            testCaseNumber: testCaseNumber + 1,
            input: inputBuffer,
            output: buffer1,
            expectedOutput: buffer2,
          });
        }
        // Resolve the promise with the differences
        resolve(differences);
        buffer1 = "";
        buffer2 = "";
        inputBuffer = "";
      }
    }

    fileStream1.on("close", () => {
      if (!fileStream2.readableEnded) {
        fileStream2.destroy(); // Clean up
      }
      if (!inputStream.readableEnded) {
        inputStream.destroy(); // Clean up
      }
    });

    fileStream2.on("close", () => {
      if (!fileStream1.readableEnded) {
        fileStream1.destroy(); // Clean up
      }
      if (!inputStream.readableEnded) {
        inputStream.destroy(); // Clean up
      }
    });

    inputStream.on("close", () => {
      if (!fileStream1.readableEnded) {
        fileStream1.destroy(); // Clean up
      }
      if (!fileStream2.readableEnded) {
        fileStream2.destroy(); // Clean up
      }
    });
  });
}
