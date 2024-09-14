"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getProblemData } from "@/core/actions/problem";
import { getProblemSubmissionsOfUser } from "@/core/actions/user";
import fetchUser from "@/lib/features/profile/profileReducer";
import { useAppDispatch } from "@/lib/hooks";
import ReactCodeMirror, {
  EditorState,
  EditorView,
} from "@uiw/react-codemirror";
import dynamic from "next/dynamic";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { BsFillFileTextFill } from "react-icons/bs";
import { FaHistory, FaTerminal } from "react-icons/fa";
import { IoIosCheckboxOutline } from "react-icons/io";
import { IoCodeSlashOutline } from "react-icons/io5";
import { toast } from "sonner";

type ProblemSubmission = {
  id: string;
  code: string;
  createdAt: Date;
  status: string;
};

type GetProblemSubmissionsResponse = {
  success: boolean;
  problemSubmissions?: ProblemSubmission[]; // Only present if success is true
  error?: string; // Only present if success is false
};
// Dynamic imports
const QuestionDescription = dynamic(
  () => import("@/components/code-editor/question-description"),
  {
    loading: () => <p className="text-black">QuestionDescriptionLoading...</p>,
  },
);

const TopBar = dynamic(() => import("@/components/code-editor/top-bar"), {
  loading: () => <p className="text-black">TopBarLoading...</p>,
});

const Editor = dynamic(() => import("@/components/code-editor/editor"), {
  loading: () => <p className="text-black">EditorLoading...</p>,
});

// Type definitions
interface ExampleData {
  input: string;
  output: string;
  explanation: string;
}

interface ProblemData {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  constraints: any;
  hints: any;
  inputs: string;
  outputs: string;
  topics: any;
  jsDriver: string;
  cppDriver: string;
  pythonDriver: string;
}

type TestCaseResult = {
  input: string;
  expectedOutput: string;
  output: string;
  result: {
    status: "success" | "failure";
    message: string;
  };
};
type Topic = {
  topicId: string;
  topic: {
    name: string;
  };
};

type Hint = {
  id: string;
  name: string;
};

type Constraint = {
  id: string;
  name: string;
};

type Problem = {
  id: string;
  title: string;
  description: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  createdAt: Date;
  updatedAt: Date;
  submissions: Submission[];
  topics: Topic[];
  hints: Hint[];
  constraints: Constraint[];
  inputs?: string | null;
  outputs?: string | null;
  pythonDriver: string | null;
  cppDriver: string | null;
  jsDriver: string | null;
};

type Submission = {
  id: string;
  language?: string | null;
  code: string;
  status:
    | "ACCEPTED"
    | "WRONG_ANSWER"
    | "TIME_LIMIT_EXCEEDED"
    | "RUNTIME_ERROR"
    | "COMPILE_ERROR";
  createdAt: Date;
  userId: string;
  problemId: string;
};

type getProblemDataResponse = {
  problem?: Problem;
  error?: string;
};

const ProblemPage: React.FC = () => {
  const { id } = useParams();
  const [question, setQuestion] = useState<Problem | null>(null);
  const [testCases, setTestCases] = useState<TestCaseResult[]>([]);
  const [submission, setSubmission] = useState<any>(null);
  const [previousSubmissions, setPreviousSubmission] = useState<
    ProblemSubmission[]
  >([]);
  const [driverCode, setDriverCode] = useState<{
    cpp: string;
    javascript: string;
    python: string;
  } | null>(null);
  const [compileError, setCompileError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("testcase");
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(fetchUser());
  }, [dispatch]);

  useEffect(() => {
    const fetchProblemData = async () => {
      try {
        console.log(`id : ${id}`);
        const { problem } = await getProblemData(id as string);
        setQuestion(problem ?? null); // If problem is undefined or null, set null

        // Update driverCode only after question is set
        if (problem) {
          setDriverCode({
            cpp: problem.cppDriver,
            javascript: problem.jsDriver,
            python: problem.pythonDriver,
          });
        }
      } catch (err: any) {
        console.log(err);
      }
    };
    fetchProblemData();
  }, [id]);

  useEffect(() => {
    async function findPreviousSubmissions() {
      // Ensure `id` is a string
      const problemId = Array.isArray(id) ? id[0] : id;

      const {
        error,
        success,
        problemSubmissions,
      }: GetProblemSubmissionsResponse =
        await getProblemSubmissionsOfUser(problemId);
      console.log(problemSubmissions);
      if (!success) {
        toast.error(error);
      } else {
        setPreviousSubmission(problemSubmissions || []); // Set submissions if available, else empty array
      }
    }

    if (id) {
      findPreviousSubmissions();
    }
  }, [id]);

  return (
    <main className="flex flex-col w-full h-[92dvh]">
      <TopBar />
      <div className="w-full h-full">
        <ResizablePanelGroup
          direction="horizontal"
          className="w-full rounded-lg gap-1 p-2"
        >
          <ResizablePanel
            defaultSize={40}
            className="bg-white p-2 w-full rounded-lg border-2 "
          >
            <Tabs
              defaultValue="description"
              className="w-full h-full overflow-auto"
            >
              <TabsList className="bg-transparent">
                <TabsTrigger value="description" className="gap-1">
                  <BsFillFileTextFill
                    className="text-blue-400 group-focus:text-red-500"
                    size={18}
                  />
                  Description
                </TabsTrigger>
                <TabsTrigger value="submissions" className="gap-1">
                  <FaHistory size={16} className="text-blue-400" />
                  Submissions
                </TabsTrigger>
              </TabsList>

              <TabsContent className="h-full w-fit" value="description">
                {question ? (
                  <QuestionDescription
                    id={question?.id}
                    title={question?.title}
                    problemStatement={question?.description}
                    level={question?.difficulty}
                    constraints={question?.constraints}
                    hints={question?.hints}
                    topics={question?.topics}
                  />
                ) : (
                  <p>Loading question details...</p>
                )}
              </TabsContent>

              <TabsContent value="submissions">
                {previousSubmissions && previousSubmissions.length > 0 ? (
                  <Accordion type="single" collapsible className="w-full">
                    {previousSubmissions.map((ps) => (
                      <AccordionItem value={`item-${ps?.id}`} key={ps?.id}>
                        <AccordionTrigger className="text-xs mx-2 w-full">
                          <div className="flex justify-between w-full">
                            <span
                              className={
                                ps?.status === "ACCEPTED"
                                  ? "text-emerald-500"
                                  : "text-red-500"
                              }
                            >
                              {ps?.status}
                            </span>
                            <p className="flex gap-4 self-end">
                              <span></span>
                              <span>
                                {new Date(ps?.createdAt).toLocaleString()}
                              </span>
                            </p>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <pre className="w-full border  overflow-x-auto p-4 bg-gray-100 rounded-xl ">
                            {" "}
                            {ps?.code}
                          </pre>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                ) : (
                  <p>No previous submissions available.</p>
                )}
              </TabsContent>
            </Tabs>
          </ResizablePanel>

          <ResizableHandle className="bg-transparent hover:bg-slate-500 my-4" />

          <ResizablePanel defaultSize={60}>
            <ResizablePanelGroup direction="vertical" className="gap-1">
              <ResizablePanel
                defaultSize={65}
                className="bg-white p-2 rounded-xl border-2 w-full h-full overflow-x-auto"
              >
                <Editor
                  setCompileError={setCompileError}
                  setSubmission={setSubmission}
                  problemId={question?.id}
                  driverCode={driverCode}
                  setTestCases={setTestCases}
                  setActiveTab={setActiveTab}
                />
              </ResizablePanel>

              <ResizableHandle className="bg-transparent hover:bg-slate-500 mx-4" />

              <ResizablePanel
                defaultSize={35}
                className="bg-white flex flex-col p-2 rounded-xl border-2 w-full h-full overflow-x-auto"
              >
                <div className="flex w-full overflow-x-auto overflow-y-auto h-full items-center justify-center">
                  <Tabs
                    defaultValue="testcase"
                    className="w-full h-full overflow-x-auto text-sm overflow-y-auto"
                  >
                    <TabsList className="bg-transparent">
                      <TabsTrigger value="testcase" className="gap-1">
                        <IoIosCheckboxOutline
                          className="text-green-400"
                          size={18}
                        />
                        Test case
                      </TabsTrigger>
                      <TabsTrigger value="testresult" className="gap-1">
                        <FaTerminal size={18} className="text-green-400" />
                        Result
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="testcase" className="text-zinc-500">
                      {compileError && (
                        <div className="bg-red-500/30 w-full text-red-500 p-3 rounded-sm whitespace-pre-wrap break-words">
                          <pre className="whitespace-pre-wrap break-words">
                            {compileError}
                          </pre>
                        </div>
                      )}

                      <Tabs defaultValue="testcase-0" className="text-zinc-500">
                        <TabsList className="space-x-2 bg-transparent">
                          {testCases?.map((test, index: number) => (
                            <TabsTrigger
                              className={`
                                px-4 py-2 rounded-md transition-colors text-xs
                                ${
                                  test?.result?.status === "success"
                                    ? "data-[state=active]:text-green-600 data-[state=active]:bg-green-500/20 text-green-600"
                                    : "data-[state=active]:text-red-500 data-[state=active]:bg-red-500/20 text-red-600"
                                }
                              `}
                              key={`tab-${index}`}
                              value={`testcase-${index}`}
                            >
                              Test Case {index + 1}
                            </TabsTrigger>
                          ))}
                        </TabsList>

                        {testCases?.map((test, index) => (
                          <TabsContent
                            key={`testcase-${index}`}
                            value={`testcase-${index}`}
                          >
                            <div className="space-y-4 p-4">
                              <div>
                                <p className="font-medium text-stone-600">
                                  Input:
                                </p>
                                <p className="rounded-sm w-full py-4 bg-slate-100 px-4 mt-1">
                                  {test.input}
                                </p>
                              </div>
                              <div>
                                <p className="font-medium text-stone-600">
                                  Your Output:
                                </p>
                                <p className="rounded-sm w-full py-4 bg-slate-100 px-4 mt-1">
                                  {test.output}
                                </p>
                              </div>
                              <div>
                                <p className="font-medium text-stone-600">
                                  Expected Output:
                                </p>
                                <p className="rounded-sm w-full py-4 bg-slate-100 px-4 mt-1">
                                  {test.expectedOutput}
                                </p>
                              </div>
                            </div>
                          </TabsContent>
                        ))}
                      </Tabs>
                    </TabsContent>

                    <TabsContent value="testresult" className="text-zinc-500">
                      {!submission || submission?.partialExecution ? (
                        <div className="text-sm text-center">
                          You must submit your code first
                        </div>
                      ) : (
                        <div className="flex flex-col m-2">
                          {compileError && (
                            <div className="bg-red-500/30 w-full text-red-500 p-3 rounded-sm whitespace-pre-wrap break-words">
                              <pre className="whitespace-pre-wrap break-words">
                                {compileError}
                              </pre>
                            </div>
                          )}
                          {submission?.status === "success" ? (
                            <>
                              <span className="flex gap-x-4 items-center">
                                <span className="text-green-500 text-2xl">
                                  {submission?.message}
                                </span>
                                <span className="text-xs">
                                  ({submission?.completedTestCases}/
                                  {submission?.totalTestCases} test cases
                                  passed)
                                </span>
                              </span>
                              <br />
                              <span className="text-xs text-slate-600">
                                Submitted at{" "}
                                {submission?.submittedAt &&
                                  new Intl.DateTimeFormat("en-US", {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    second: "2-digit",
                                    hour12: true,
                                  }).format(new Date(submission?.submittedAt))}
                              </span>
                            </>
                          ) : (
                            <>
                              <span className="flex gap-x-4 items-center">
                                <span className="text-red-500 font-bold text-xl">
                                  {submission?.message}
                                </span>
                                <span className="text-xs">
                                  ({submission?.completedTestCases}/
                                  {submission?.totalTestCases} test cases
                                  passed)
                                </span>
                              </span>
                              <span className="text-xs text-slate-600 mb-6">
                                Submitted at{" "}
                                {submission?.submittedAt &&
                                  new Intl.DateTimeFormat("en-US", {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    second: "2-digit",
                                    hour12: true,
                                  }).format(new Date(submission?.submittedAt))}
                              </span>
                              {submission?.failedCases &&
                              submission.failedCases.length > 0 ? (
                                <>
                                  <span className="h-full">
                                    Input: {submission.failedCases[0].input}
                                  </span>
                                  <br />
                                  <span className="h-full">
                                    Output: {submission.failedCases[0].output}
                                  </span>
                                  <br />
                                  <span className="h-full">
                                    Expected Output:{" "}
                                    {submission.failedCases[0].expectedOutput}
                                  </span>
                                </>
                              ) : (
                                <div>No failed cases available</div>
                              )}
                            </>
                          )}
                          {submission && (
                            <div className="rounded-xl overflow-hidden border bg-stone-100">
                              <p className="text-black font-semibold p-2">
                                Submitted Code (Language -{" "}
                                {submission?.language})
                              </p>
                              <ReactCodeMirror
                                value={submission?.codeSnippet}
                                width="100%"
                                className="h-full"
                                basicSetup={{ lineNumbers: false }}
                                extensions={[
                                  EditorView.editable.of(false),
                                  EditorState.readOnly.of(true),
                                ]}
                              />
                            </div>
                          )}
                        </div>
                      )}
                    </TabsContent>
                  </Tabs>
                </div>
                <div className="flex items-center gap-2 text-sm bg-slate-100 h-10 px-4 text-zinc-500">
                  <IoCodeSlashOutline size={18} />
                  Source
                </div>
              </ResizablePanel>
            </ResizablePanelGroup>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </main>
  );
};

export default ProblemPage;
