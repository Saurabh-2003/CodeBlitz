"use client";

import { Input } from "@/components/ui/input";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import dynamic from "next/dynamic";
import React, { lazy, Suspense } from "react";
import { AiFillExperiment } from "react-icons/ai";
import { BsFillFileTextFill } from "react-icons/bs";
import { FaHistory, FaTerminal } from "react-icons/fa";
import { GoBook } from "react-icons/go";
import { IoIosCheckboxOutline } from "react-icons/io";
import { IoCodeSlashOutline } from "react-icons/io5";

const QuestionDescription = dynamic(
  () => import("@/components/code-editor/question-description"),
  {
    loading: () => <p className="text-black">QuestionDescriptionLoading...</p>,
  },
);

const TopBar = dynamic(() => import("@/components/code-editor/top-bar"), {
  loading: () => <p className="text-black">TopBarLoading...</p>,
});

const Editor = lazy(() => import("@/components/code-editor/editor"));

const Page: React.FC = () => {
  const questionData = {
    _id: 1,
    level: "easy",
    topics: ["Arrays", "Dynamic Programming"],
    companies: ["Google", "Facebook"],
    title: "Longest Increasing Subsequence",
    titleSlug: "longest-increasing-subsequence",
    likes: 120,
    dislikes: 5,
    problemStatement:
      "You are given an array of strings names, and an array heights that consists of distinct positive integers. Both arrays are of length n.For each index i, names[i] and heights[i] denote the name and height of the ith person.Return names sorted in descending order by the people's heights.",
    codeSnippets: [
      {
        lang: "JavaScript",
        langSlug: "javascript",
        code: `var lengthOfLIS = function(nums) {
          const dp = new Array(nums.length).fill(1);
          for (let i = 1; i < nums.length; i++) {
            for (let j = 0; j < i; j++) {
              if (nums[i] > nums[j]) {
                dp[i] = Math.max(dp[i], dp[j] + 1);
              }
            }
          }
          return Math.max(...dp);
        };`,
      },
    ],
    testCases: [
      {
        _id: 1,
        input: "[10,9,2,5,3,7,101,18]",
        expectedOutput: "4",
      },
      {
        _id: 2,
        input: "[10,9,2,5,3,7,101,18]",
        expectedOutput: "4",
      },
      {
        _id: 3,
        input: "[10,9,2,5,3,7,101,18]",
        expectedOutput: "4",
      },
    ],
    constraints: ["1 <= x <= 10^9", "1 <= y <= 10^9", "1 <= z <= 10^9"],
    examples: [
      {
        input: "[10,9,2,5,3,7,101,18]",
        output: "4",
        explanation:
          "The longest increasing subsequence is [2,3,7,101], therefore the length is 4.",
      },
      {
        input: "[10,9,2,5,3,7,101,18]",
        output: "4",
        explanation:
          "The longest increasing subsequence is [2,3,7,101], therefore the length is 4.",
      },
      {
        input: "[10,9,2,5,3,7,101,18]",
        output: "4",
        explanation:
          "The longest increasing subsequence is [2,3,7,101], therefore the length is 4.",
      },
    ],
    hints: [
      "First make two for loops",
      "check each pair of numbers",
      "check the sum of both the values",
      "return the answer",
    ],
    __v: 0,
  };

  return (
    <main className="flex flex-col w-full h-[92dvh]">
      <TopBar />
      <div className="w-full h-full">
        <ResizablePanelGroup
          direction="horizontal"
          className="w-full rounded-lg gap-1 py-2 "
        >
          <ResizablePanel
            defaultSize={40}
            className="bg-white p-2 w-full rounded-lg "
          >
            <Tabs
              defaultValue="description"
              className="w-full h-full  overflow-auto "
            >
              <TabsList className="bg-transparent ">
                <TabsTrigger value="description" className="gap-1">
                  <BsFillFileTextFill
                    className="text-blue-400 group-focus:text-red-500"
                    size={18}
                  />
                  Description
                </TabsTrigger>
                <TabsTrigger value="editorial" className="gap-1">
                  <GoBook size={18} className="text-amber-400" />
                  Editorial
                </TabsTrigger>
                <TabsTrigger value="solutions" className="gap-1">
                  <AiFillExperiment size={18} className="text-blue-400" />
                  Solutions
                </TabsTrigger>
                <TabsTrigger value="submissions" className="gap-1">
                  <FaHistory size={16} className="text-blue-400" />
                  Submissions
                </TabsTrigger>
              </TabsList>
              <TabsContent className="h-full w-fit " value="description">
                <QuestionDescription
                  id={questionData._id}
                  title={questionData.title}
                  problemStatement={questionData.problemStatement}
                  level={questionData.level}
                  constraints={questionData.constraints}
                  companies={questionData.companies}
                  hints={questionData.hints}
                  topics={questionData.topics}
                  examples={questionData.examples}
                />
              </TabsContent>

              <TabsContent value="editorial">
                Change your password here.
              </TabsContent>
              <TabsContent value="solutions">
                Make changes to your account here.
              </TabsContent>
              <TabsContent value="submissions">
                Change your password here.
              </TabsContent>
            </Tabs>
          </ResizablePanel>
          <ResizableHandle className="bg-transparent hover:bg-slate-500 my-4" />
          <ResizablePanel defaultSize={60}>
            <ResizablePanelGroup direction="vertical" className="gap-1">
              <ResizablePanel
                defaultSize={65}
                className="bg-white p-2 rounded-lg w-full h-full overflow-x-auto"
              >
                <div className=" h-full ">
                  <Suspense
                    fallback={
                      <div className="text-black">Editor Loading... </div>
                    }
                  >
                    <Editor />
                  </Suspense>
                </div>
              </ResizablePanel>
              <ResizableHandle className="bg-transparent hover:bg-slate-500 mx-4" />
              <ResizablePanel
                defaultSize={35}
                className="bg-white flex flex-col p-2 rounded-lg w-full h-full overflow-x-auto"
              >
                <div className="flex w-full overflow-x-auto overflow-y-auto h-full items-center justify-center">
                  <Tabs
                    defaultValue="testcase"
                    className="w-full h-full overflow-x-auto text-sm overflow-y-auto"
                  >
                    <TabsList className=" bg-transparent">
                      <TabsTrigger value="testcase" className="gap-1">
                        <IoIosCheckboxOutline
                          className="text-green-400"
                          size={18}
                        />
                        Test case
                      </TabsTrigger>
                      <TabsTrigger value="testresult" className="gap-1">
                        <FaTerminal size={18} className="text-green-400" />
                        Test Result
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="testcase" className="text-zinc-500">
                      nums =
                      <Input className="border bg-gray-100 focus-visible:ring-0 outline-none focus:border-blue-400" />
                      ans =
                      <Input className="border bg-gray-100 ring-0 focus-visible:ring-0 focus:border-blue-400" />
                    </TabsContent>
                    <TabsContent value="testresult" className="text-zinc-500">
                      n =
                      <Input className="border mb-2 bg-gray-100 focus-visible:ring-0 outline-none focus:border-blue-400" />
                      nums =
                      <Input className="border mb-2 ring-0 bg-gray-100 focus-visible:ring-0 focus:border-blue-400" />
                      output =
                      <Input className="border mb-2 bg-gray-100 focus-visible:ring-0 outline-none focus:border-blue-400" />
                      expected =
                      <Input className="border mb-2 bg-gray-100 ring-0 focus-visible:ring-0 focus:border-blue-400" />
                    </TabsContent>
                  </Tabs>
                </div>
                <div className="flex items-center gap-2 text-sm text-zinc-500">
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

export default Page;
