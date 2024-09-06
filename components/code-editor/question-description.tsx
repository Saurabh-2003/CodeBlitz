"use client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FaRegLightbulb } from "react-icons/fa";
import { GoTag } from "react-icons/go";
import { Label } from "../ui/label";

// Type definitions
interface ExampleProps {
  input: string;
  output: string;
  explanation: string;
}

interface ConstraintProps {
  text: string;
}

interface ExampleData {
  input: string;
  output: string;
  explanation: string;
}

interface ConstraintData {
  name: string;
}

interface TopicData {
  topicId: string;
  topic: {
    name: string;
  };
}

interface HintData {
  name: string;
}

interface QuestionDescriptionProps {
  id: string; // Changed to string to match your data example
  title: string;
  problemStatement: string;
  level: string; // Updated to use specific values
  constraints: ConstraintData[]; // Updated type
  examples: ExampleData[];
  hints: HintData[]; // Updated type
  topics: TopicData[]; // Updated type
}

// Example component
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

// Constraint component
const Constraint: React.FC<ConstraintProps> = ({ text }) => {
  const renderText = (text: string) => {
    if (!text) return null; // Ensure text is defined
    const parts = text.split(/(\^\d+)/); // Split on superscript pattern
    return parts.map((part, index) => {
      if (part.startsWith("^")) {
        return <sup key={index}>{part.slice(1)}</sup>;
      }
      return part;
    });
  };

  return (
    <div className="border bg-zinc-100 rounded-sm text-zinc-600 border-slate-300 text-xs px-2 py-1 w-fit">
      {renderText(text)}
    </div>
  );
};

// QuestionDescription component
const QuestionDescription: React.FC<QuestionDescriptionProps> = ({
  id,
  title,
  problemStatement,
  level,
  constraints,
  examples,
  hints,
  topics,
}) => (
  <div className="flex flex-col gap-2 p-4 w-full">
    <span className="text-xl font-bold ">{title}</span>

    <div className="flex gap-2 mb-2">
      <span
        className={`text-xs w-16 text-balance text-center py-1 rounded-full ${
          level === "EASY"
            ? "bg-green-100 text-green-800"
            : level === "MEDIUM"
              ? "bg-amber-200/50 text-yellow-500"
              : "bg-red-100 text-red-800"
        }`}
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
          <Constraint text={constraint?.name || ""} />{" "}
          {/* Default to empty string if name is undefined */}
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
          {topics.map((topic) => (
            <span
              key={topic.topicId}
              className="text-xs w-fit px-3 border border-zinc-200 bg-zinc-100 text-zinc-600 text-center py-[2px] rounded-full"
            >
              {topic?.topic?.name}
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
            <AccordionContent>{hint?.name}</AccordionContent>
          </AccordionItem>
        </Accordion>
      ))}
    </div>
  </div>
);

export default QuestionDescription;
