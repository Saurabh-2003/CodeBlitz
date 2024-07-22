"use client";
import ReactCodeMirror from "@uiw/react-codemirror";
import { loadLanguage } from "@uiw/codemirror-extensions-langs";
import { tokyoNight } from "@uiw/codemirror-theme-tokyo-night";
import { xcodeLight, xcodeDark } from "@uiw/codemirror-theme-xcode";
import { githubLight, githubDark } from "@uiw/codemirror-theme-github";
import { useState } from "react";

export const Editor = () => {
  const [initCode, setInitCode] = useState<string>("");
  const [code, setCode] = useState<string>("");
  return (
    <ReactCodeMirror
      value={code === "" || code == null ? initCode || "" : code || ""}
      extensions={[loadLanguage("cpp")!]}
      theme={xcodeLight}
      onChange={(value) => {
        setCode(value);
      }}
      width="100%"
      height="100%"
      className=" h-full"
    />
  );
};
