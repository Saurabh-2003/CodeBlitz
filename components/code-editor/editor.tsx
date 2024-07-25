// components/Editor.tsx
"use client";

import { handleCPPCode } from "@/core/actions/coderun/runCppCode";
import { loadLanguage } from "@uiw/codemirror-extensions-langs";
import { xcodeLight } from "@uiw/codemirror-theme-xcode";
import ReactCodeMirror from "@uiw/react-codemirror";
import { useState } from "react";
import { Button } from "../ui/button";

export const Editor = () => {
  const [initCode, setInitCode] = useState<string>("");
  const [code, setCode] = useState<string>("");
  const [output, setOutput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const runCode = async () => {
    setLoading(true);
    try {
      const result = await handleCPPCode(code);
      setOutput(result.outputValue);
    } catch (error: any) {
      setOutput(`Error: ${error.message || error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="editor-container">
      <ReactCodeMirror
        value={code || initCode || ""}
        extensions={[loadLanguage("cpp")!]}
        theme={xcodeLight}
        onChange={(value) => {
          setCode(value);
        }}
        width="100%"
        height="400px"
        className="h-full"
      />
      <Button onClick={runCode} disabled={loading}>
        {loading ? "Running..." : "Run Code"}
      </Button>
      <pre>{output}</pre>
    </div>
  );
};
