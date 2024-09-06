import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { IoAlarmOutline } from "react-icons/io5";
import { MdAlarmOff } from "react-icons/md";
import { toast } from "sonner";
import { Button } from "../ui/button";

const TopBar = () => {
  const [timer, setTimer] = useState<number | null>(null); // Store the remaining time in seconds
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);

  const startTimer = () => {
    if (intervalId) return; // Avoid starting multiple timers

    const startTime = Date.now();
    const endTime = startTime + 40 * 60 * 1000; // 40 minutes

    const id = setInterval(() => {
      const now = Date.now();
      const timeLeft = Math.max(endTime - now, 0);

      if (timeLeft === 0) {
        clearInterval(id);
        setIntervalId(null);
        setTimer(null); // Stop displaying timer
        toast.success("timer completed"); // Show toast message
      } else {
        setTimer(Math.ceil(timeLeft / 1000)); // Convert milliseconds to seconds
      }
    }, 1000);

    setIntervalId(id);
  };

  const cancelTimer = () => {
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
      setTimer(null); // Stop displaying timer
    }
  };

  // Format the timer in MM:SS
  const formatTime = (seconds: number | null) => {
    if (seconds === null) return "00:00";

    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  return (
    <aside className="flex justify-between items-center w-full py-1 px-2 border-b text-sm text-slate-600">
      <div className="flex items-center gap-2">
        <Image
          height={20}
          width={20}
          src="/codeblitz.png"
          alt="icon"
          className="size-6"
        />
        <span className=" font-bold">CodeBlitz </span>
      </div>

      <div className="flex items-center gap-1">
        <div
          className="flex gap-2 cursor-pointer bg-zinc-200 rounded-sm p-2 items-center"
          aria-label="start timer"
        >
          {timer === null ? (
            <IoAlarmOutline size={25} onClick={() => startTimer()} />
          ) : (
            <MdAlarmOff
              size={25}
              className="text-red-500"
              onClick={() => cancelTimer()}
            />
          )}
          {timer !== null && timer > 0 && <span>{formatTime(timer)}</span>}
        </div>
      </div>

      <div className="flex gap-4 items-center">
        <Link href={"/problem"}>
          <Button className="bg-amber-600/20 text-amber-500 hover:bg-amber-600/10">
            Problems
          </Button>
        </Link>
      </div>
    </aside>
  );
};

export default TopBar;
