"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserDetail } from "@/core";
import submitAllCode from "@/core/actions/coderun/submitCode";
import { loadLanguage } from "@uiw/codemirror-extensions-langs";
import { xcodeLight } from "@uiw/codemirror-theme-xcode";
import ReactCodeMirror from "@uiw/react-codemirror";
import { revalidatePath } from "next/cache";
import React, { SetStateAction, useEffect, useState } from "react";
import { BiLoaderAlt } from "react-icons/bi";
import { FaPlay } from "react-icons/fa";
import { IoCodeSlashOutline } from "react-icons/io5";
import { MdOutlineCloudUpload } from "react-icons/md";
import { toast } from "sonner";

// Language mapping
const languageMap = {
  cpp: loadLanguage("cpp"),
  javascript: loadLanguage("javascript"),
  python: loadLanguage("python"),
};

// Types for the editor props
interface EditorProps {
  driverCode: Record<string, string> | null; // Update type to allow null
  problemId: string | undefined;
  setSubmission: React.Dispatch<SetStateAction<any>>;
  setTestCases: React.Dispatch<SetStateAction<any>>;
  setActiveTab: React.Dispatch<SetStateAction<string>>; // Pass a function to set the active tab
  setCompileError: React.Dispatch<SetStateAction<string>>;
}

const Editor: React.FC<EditorProps> = ({
  driverCode = {}, // Provide default empty object to handle null case
  problemId,
  setSubmission,
  setTestCases,
  setActiveTab, // Added prop for controlling active tab
  setCompileError,
}) => {
  const [code, setCode] = useState<string>(""); // Code for the editor
  const [output, setOutput] = useState<string>(""); // Output from code run
  const [loadingRun, setLoadingRun] = useState<boolean>(false); // Run button loading state
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false); // Submit button state
  const [language, setLanguage] = useState<string>("cpp"); // Selected language
  const [editorExtensions, setEditorExtensions] = useState<any>(
    languageMap["cpp"],
  ); // Editor config
  const [user, setUser] = useState<any>(null); // User details

  // Fetch user details on component mount
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await UserDetail();
        setUser(response.user);
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };
    fetchUserDetails();
  }, []);

  // Update editor extensions when language changes
  useEffect(() => {
    setEditorExtensions(languageMap[language]);
  }, [language]);

  // Set initial code based on selected language
  useEffect(() => {
    if (driverCode) {
      setCode(driverCode[language] || "");
    }
  }, [language, driverCode]);

  // Helper function to handle code execution (for "Run" and "Submit")
  const handleCodeExecution = async (isPartial: boolean) => {
    if (!code || !problemId || !user?.id) return;

    if (isPartial) {
      setLoadingRun(true); // Only set loading for "Run"
    } else {
      setIsSubmitting(true); // Only set submitting for "Submit"
    }

    try {
      const solution = {
        lang: language,
        code,
        problemId,
        userId: user.id,
        onlyPartialTests: isPartial, // Determines if it's a run (partial) or submit (full)
      };
      const result = await submitAllCode(solution);

      if (
        result?.success === "error" &&
        result?.message === "Compilation Error"
      ) {
        setCompileError(result?.error);
      } else {
        setCompileError(null);
      }
      if (isPartial) {
        setTestCases(result?.results);

        setActiveTab("testcase"); // Switch to test cases tab on successful "Run"
      } else {
        setSubmission(result);
        if (result?.status === "success") {
          toast.success(result?.message);
          setCompileError(null);
          setActiveTab("submission"); // Switch to submission tab on successful "Submit"
          revalidatePath("/problem", "page");
        } else if (result?.error) {
          toast.error(result?.error);
        }
      }
    } catch (error: any) {
      setOutput(`Error: ${error.message || error}`);
    } finally {
      if (isPartial) {
        setLoadingRun(false); // Stop "Run" loading state
      } else {
        setIsSubmitting(false); // Stop "Submit" loading state
      }
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header with language selector */}
      <div className="flex text-zinc-600 justify-between items-center p-2 bg-zinc-100/50">
        <div className="flex gap-8">
          <div className="flex items-center gap-1 text-sm">
            <IoCodeSlashOutline size={20} className="text-green-500" />
            Code
          </div>

          <Select
            value={language}
            disabled={loadingRun || isSubmitting}
            onValueChange={(value) => setLanguage(value)}
          >
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

        {/* Buttons for running and submitting code */}
        <div
          className={`flex gap-4 transition-all duration-300 ${isSubmitting && "gap-0"}`}
        >
          {/* Run button */}
          <button
            className={`flex gap-2 bg-zinc-200 rounded-sm py-2 px-4 items-center transition-all duration-500 ${
              isSubmitting ? "w-0 opacity-0" : "w-fit opacity-100"
            }`}
            onClick={() => handleCodeExecution(true)} // Only runs partial tests
            disabled={loadingRun || isSubmitting}
          >
            {loadingRun ? (
              <div className="flex items-center gap-2">
                <BiLoaderAlt className="animate-spin" />
                Running...
              </div>
            ) : (
              <>
                <FaPlay size={20} />
                <span>Run</span>
              </>
            )}
          </button>

          {/* Submit button */}
          <button
            onClick={() => handleCodeExecution(false)} // Submits the code
            disabled={loadingRun || isSubmitting}
            className={`flex gap-2 cursor-pointer bg-zinc-200 transition-all duration-500 text-green-600 rounded-sm items-center ${
              loadingRun ? "w-0 opacity-0" : "w-fit py-2 px-4 opacity-100"
            }`}
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <BiLoaderAlt className="animate-spin" />
                Judging...
              </div>
            ) : (
              <>
                <MdOutlineCloudUpload size={20} />
                <span>Submit</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Code editor */}
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
