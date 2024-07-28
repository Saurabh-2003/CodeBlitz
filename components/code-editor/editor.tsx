"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { handleCPPCode } from "@/core/actions/coderun/runCppCode";
import { handleJSCode } from "@/core/actions/coderun/runJavascriptCode";
import { handlePythonCode } from "@/core/actions/coderun/runPythonCode";
import { loadLanguage } from "@uiw/codemirror-extensions-langs";
import { xcodeLight } from "@uiw/codemirror-theme-xcode";
import ReactCodeMirror from "@uiw/react-codemirror";
import { useEffect, useState } from "react";
import { IoCodeSlashOutline } from "react-icons/io5";

const languageMap: Record<string, any> = {
  cpp: loadLanguage("cpp"),
  javascript: loadLanguage("javascript"),
  python: loadLanguage("python"),
};

const Editor = () => {
  const [code, setCode] = useState<string>("");
  const [output, setOutput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [language, setLanguage] = useState<string>("cpp");

  const [editorExtensions, setEditorExtensions] = useState<any>(
    languageMap["cpp"],
  );

  useEffect(() => {
    setEditorExtensions(languageMap[language]);
  }, [language]);

  const runCode = async () => {
    setLoading(true);
    try {
      let result;
      switch (language) {
        case "cpp":
          result = await handleCPPCode(code);
          break;
        case "javascript":
          result = await handleJSCode(code);
          break;
        case "python":
          result = await handlePythonCode(code);
          break;
        default:
          throw new Error("Unsupported language");
      }
      setOutput(result.outputValue);
    } catch (error: any) {
      setOutput(`Error: ${error.message || error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex text-zinc-600 justify-between items-center p-2 bg-zinc-100/50">
        <div className="flex items-center gap-2">
          <IoCodeSlashOutline size={20} className="text-green-500" />
          Code
        </div>
        <Select onValueChange={(value) => setLanguage(value)}>
          <SelectTrigger className="border w-36 rounded text-xs py-1 outline-none cursor-pointer">
            <SelectValue placeholder="Select Language" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="cpp">C++</SelectItem>
            <SelectItem value="javascript">JavaScript</SelectItem>
            <SelectItem value="python">Python</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="overflow-y-auto">
        <ReactCodeMirror
          value={code}
          extensions={[editorExtensions]}
          theme={xcodeLight}
          onChange={(value) => setCode(value)}
          width="100%"
          className="h-full"
        />
      </div>
    </div>
  );
};

export default Editor;
