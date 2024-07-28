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
    <div className="border bg-zinc-100 rounded-sm text-zinc-600 border-slate-300 text-xs px-2 py- w-fit">
      {renderText(text)}
    </div>
  );
};

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
  <div className="flex flex-col gap-2 p-4 w-full">
    <span className="text-xl font-bold ">
      {id}. {title}
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

export default QuestionDescription;
