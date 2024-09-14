import React from "react";

interface CircleProps {
  totalSolved: number;
  totalProblems: number;
}

const Circle: React.FC<CircleProps> = ({ totalSolved, totalProblems }) => {
  const circumference = 2 * Math.PI * 46;
  const percentage = (totalSolved / totalProblems) * 100;
  const dashLength = circumference * (percentage / 100);

  return (
    <div className=" flex min-w-[100px] justify-center">
      <div className="shrink-1 z-base relative max-h-[100px] max-w-[100px]">
        <svg
          className="h-full w-full origin-center -rotate-90 transform"
          viewBox="0 0 100 100"
        >
          <circle
            fill="none"
            cx="50px"
            cy="50px"
            r="46"
            strokeWidth="3"
            strokeLinecap="round"
            stroke="#4B4A4B"
            className="w-[100px]"
          ></circle>
          {dashLength > 0 && (
            <circle
              fill="none"
              cx="50px"
              cy="50px"
              r="46"
              strokeWidth="5"
              strokeLinecap="round"
              stroke="#FFC11F"
              className="cursor-pointer"
              strokeDasharray={`${dashLength} ${circumference}`}
              strokeDashoffset="0"
            ></circle>
          )}
        </svg>
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform cursor-default text-center">
          <div>
            <div className="text-[24px] font-medium dark:text-zinc-200 ">
              {totalSolved}
            </div>
            <div className="whitespace-nowrap text-xs text-label-3 dark:text-zinc-400">
              Solved
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface LineProps {
  color: string;
  total: number;
  solved: number;
}

const Line: React.FC<LineProps> = ({ color, total, solved }) => {
  const percentage = Math.round((solved / total) * 100);
  const width = (percentage / 100) * 200; // Adjusted width to match the container size

  return (
    <div className="rounded-lg h-[9px] w-[200px] bg-gray-300">
      <div
        style={{ width: `${width}px` }}
        className={`bg-[#01B8A2] rounded-lg h-[9px] ${color}`}
      ></div>
    </div>
  );
};

interface QuestionsProps {
  type: string;
  solved: number;
  total: number;
  color: string;
}

const Questions: React.FC<QuestionsProps> = ({
  type,
  solved,
  total,
  color,
}) => {
  return (
    <div className="mb-2">
      <div className="flex justify-between w-[200px] mb-1">
        <p className="w-[50px] dark:text-zinc-200  text-sm">{type}</p>
        <div className="flex items-center">
          <span className="ml-[9px] mr-[5px] text-xs dark:text-zinc-300 font-medium leading-[20px] text-stone-500">
            {solved}
          </span>
          <span className="text-sm font-medium text-stone-700 dark:text-zinc-300">
            /{total}
          </span>
        </div>
      </div>
      <Line color={color} total={total} solved={solved} />
    </div>
  );
};

interface StatsCardProps {
  totalSolved: number;
  totalProblems: number;
  easySolved: number;
  easyTotal: number;
  mediumSolved: number;
  mediumTotal: number;
  hardSolved: number;
  hardTotal: number;
}

const StatsCard: React.FC<StatsCardProps> = ({
  totalSolved,
  totalProblems,
  easySolved,
  easyTotal,
  mediumSolved,
  mediumTotal,
  hardSolved,
  hardTotal,
}) => {
  return (
    <div className=" w-full   text-stone-800 flex justify-center flex-col items-center rounded h-full ">
      <div className="flex gap-1 xl:gap-4 items-center justify-between mb-4">
        <Circle totalSolved={totalSolved} totalProblems={totalProblems} />
      </div>

      <div className="flex flex-col gap-1">
        <Questions
          type="Easy"
          solved={easySolved}
          total={easyTotal}
          color="bg-[#01B8A2]"
        />
        <Questions
          type="Medium"
          solved={mediumSolved}
          total={mediumTotal}
          color="bg-[#FFC11F]"
        />
        <Questions
          type="Hard"
          solved={hardSolved}
          total={hardTotal}
          color="bg-[#EF4642]"
        />
      </div>
    </div>
  );
};

export default StatsCard;
