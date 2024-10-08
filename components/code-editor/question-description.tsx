"use client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FaRegLightbulb } from "react-icons/fa";
import { GoTag } from "react-icons/go";
import { Badge } from "../ui/badge";
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
  hints: HintData[]; // Updated type
  topics: TopicData[]; // Updated type
}

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
    <div className="border bg-zinc-100 dark:bg-zinc-700 dark:text-zinc-300 dark:border-zinc-500 rounded-sm text-zinc-600 border-slate-300 text-xs px-2 py-1 w-fit">
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
  hints,
  topics,
}) => (
  <div className="flex flex-col gap-2 p-4 w-full">
    <span className="text-xl font-bold dark:text-zinc-200">{title}</span>

    <div className="flex gap-2 mb-2">
      <span
        className={`text-xs w-16 text-balance text-center py-1 rounded-full ${
          level === "EASY"
            ? "bg-green-100 dark:bg-green-500/20 dark:text-emerald-500 text-green-800"
            : level === "MEDIUM"
              ? "bg-amber-200/50 text-yellow-500"
              : "bg-red-100 text-red-800"
        }`}
      >
        {level}
      </span>
    </div>

    <div
      dangerouslySetInnerHTML={{
        __html: `<div>${problemStatement}</div>`,
      }}
    />

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
            <Badge
              className="bg-zinc-700 dark:text-zinc-300"
              key={topic.topicId}
            >
              {topic?.topic?.name}
            </Badge>
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
            <AccordionContent className="dark:text-zinc-300">
              {hint?.name}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      ))}
    </div>
  </div>
);

export default QuestionDescription;
