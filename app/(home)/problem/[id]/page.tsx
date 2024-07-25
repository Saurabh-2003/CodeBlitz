/** eslint-disable react/jsx-no-undef */
/** eslint-disable react/jsx-no-undef */
/** eslint-disable react/jsx-no-undef */
/** eslint-disable react/jsx-no-undef */
/** eslint-disable react/jsx-no-comment-textnodes */
/** eslint-disable react/jsx-no-undef */
/** eslint-disable react/jsx-no-undef */
import { Editor } from "@/components/code-editor/editor";
import { LanguageDropDown } from "@/components/code-editor/language-dropdown";
import TopBar from "@/components/code-editor/top-bar";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@radix-ui/react-dropdown-menu";
import { Maximize2 } from "lucide-react";
import React from "react";
import { AiFillExperiment } from "react-icons/ai";
import { BsFillFileTextFill } from "react-icons/bs";
import { FaHistory, FaRegLightbulb, FaTerminal } from "react-icons/fa";
import { GoBook, GoTag } from "react-icons/go";
import { GrPowerReset } from "react-icons/gr";
import { IoIosCheckboxOutline } from "react-icons/io";
import { IoCodeSlashOutline } from "react-icons/io5";
import { LuMaximize } from "react-icons/lu";

// Define types for props
interface ExampleProps {
  input: string;
  output: string;
  explanation: string;
}

const Example: React.FC<ExampleProps> = ({ input, output, explanation }) => (
  <div className="pl-6 border-l mt-1">
    <span className="text-sm">
      <strong>Input: </strong> {input}
      <br />
      <strong>Output: </strong> {output}
      <br />
      <strong>Explanation: </strong> {explanation}
    </span>
  </div>
);

interface ConstraintProps {
  text: string;
}

const Constraint: React.FC<ConstraintProps> = ({ text }) => {
  const renderText = (text: string) => {
    const parts = text.split(/(\^\d+)/); // Split on superscript pattern
    return parts.map((part, index) => {
      if (part.startsWith("^")) {
        return <sup key={index}>{part.slice(1)}</sup>;
      }
      return part;
    });
  };

  return (
    <div className="border bg-zinc-100 rounded-lg text-zinc-600 border-slate-300 px-2 py- w-fit">
      {renderText(text)}
    </div>
  );
};

// Define types for question data
interface ExampleData {
  input: string;
  output: string;
  explanation: string;
}

interface QuestionDescriptionProps {
  id: number;
  title: string;
  problemStatement: string;
  level: string;
  constraints: string[];
  companies: string[];
  examples: ExampleData[];
  hints: string[];
  topics: string[];
}

const QuestionDescription: React.FC<QuestionDescriptionProps> = ({
  id,
  title,
  problemStatement,
  level,
  constraints,
  companies,
  examples,
  hints,
  topics,
}) => (
  <div className="flex flex-col gap-2 p-4">
    <span className="text-xl font-bold ">
      {id}. {title}
      <br />
    </span>

    <div className="flex gap-2 mb-2">
      <span
        className={`text-xs w-16 text-balance text-center py-1 rounded-full ${level === "easy" ? "bg-green-100 text-green-800" : level === "medium" ? "bg-amber-200/50 text-yellow-500" : "bg-red-100 text-red-800"}`}
      >
        {level}
      </span>
    </div>

    <p>{problemStatement}</p>
    {examples.map((example, index) => (
      <div key={index} className="">
        <strong>Example {index + 1}:</strong>
        <br />
        <Example {...example} />
      </div>
    ))}
    <Label className="text-sm font-bold mt-6">Constraints:</Label>
    <ul className="flex list-disc flex-col gap-2 ml-4 text-sm my-2">
      {constraints.map((constraint, index) => (
        <li key={index}>
          <Constraint text={constraint} />
        </li>
      ))}
    </ul>

    <Accordion type="single" collapsible>
      <AccordionItem value="item-1">
        <AccordionTrigger className="text-xs gap-2 font-medium">
          <div className="flex items-center gap-2">
            <GoTag />
            <span>Topics</span>
          </div>
        </AccordionTrigger>
        <AccordionContent className="my-1 flex gap-2 flex-wrap">
          {topics.map((topic, index) => (
            <span
              key={index}
              className="text-xs w-fit px-3 border border-zinc-200 bg-zinc-100 text-zinc-600 text-center py-[2px] rounded-full"
            >
              {topic}
            </span>
          ))}
        </AccordionContent>
      </AccordionItem>
    </Accordion>

    <div>
      {hints.map((hint, index) => (
        <Accordion key={index} type="single" collapsible>
          <AccordionItem value={`item-${index}`}>
            <AccordionTrigger className="text-xs gap-2 font-medium">
              <div className="flex items-center gap-2">
                <FaRegLightbulb />
                <span>Hint {index}</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>{hint}</AccordionContent>
          </AccordionItem>
        </Accordion>
      ))}
    </div>

    <div className="flex flex-wrap gap-2 my-2">
      {companies.map((company, index) => (
        <span
          key={index}
          className="bg-zinc-200 text-zinc-600 text-xs rounded-full py-1 px-2 border border-zinc-300"
        >
          {company}
        </span>
      ))}
    </div>
  </div>
);

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
    <main className="flex flex-col h-dvh max-h-dvh">
      <TopBar />
      <div className="w-full h-full">
        <ResizablePanelGroup
          direction="horizontal"
          className="w-full rounded-lg gap-1 py-2"
        >
          <ResizablePanel
            defaultSize={40}
            className="bg-white p-2 w-full rounded-lg"
          >
            <Tabs
              defaultValue="description"
              className="w-full h-full overflow-x-auto overflow-y-auto"
            >
              <TabsList className="bg-transparent">
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
              <TabsContent className="h-full" value="description">
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
                <div className="h-full flex flex-col">
                  <div className="flex text-zinc-600 justify-between items-center p-2 bg-zinc-100/50 sticky top-0">
                    <div className="flex items-center gap-2">
                      <IoCodeSlashOutline
                        size={20}
                        className="text-green-500"
                      />
                      Code
                    </div>
                    <LuMaximize size={20} />
                  </div>
                  <div className="flex py-2 text-zinc-600 justify-between items-center top-0">
                    <LanguageDropDown />
                    <div className="flex items-center gap-2">
                      <GrPowerReset size={16} />
                      <Maximize2 size={15} />
                    </div>
                  </div>
                  <div className="overflow-y-auto">
                    <Editor />
                  </div>
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
                    <TabsList className="">
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
