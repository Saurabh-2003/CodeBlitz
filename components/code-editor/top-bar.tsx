import { useTheme } from "@/core/context/theme-context";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { BsSun } from "react-icons/bs";
import { IoAlarmOutline } from "react-icons/io5";
import { LuRefreshCw } from "react-icons/lu";
import {
    MdAlarmOff,
    MdDarkMode,
    MdOutlinePauseCircleOutline,
    MdOutlinePlayCircleOutline,
} from "react-icons/md";
import { toast } from "sonner";
import UserDropdownMenu from "../common/user-dropdown-header";

const TopBar = () => {
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const startTimer = useCallback(() => {
    if (isRunning) return;
    setIsRunning(true);
    setIsPaused(false);
    setTimeLeft(40 * 60);
  }, [isRunning]);

  const cancelTimer = useCallback(() => {
    setIsRunning(false);
    setIsPaused(false);
    setTimeLeft(null);
  }, []);

  const pauseTimer = useCallback(() => {
    setIsPaused(true);
  }, []);

  const resumeTimer = useCallback(() => {
    setIsPaused(false);
  }, []);

  const resetTimer = useCallback(() => {
    setTimeLeft(40 * 60); // Reset to 40 minutes
    setIsPaused(true); // Pause the timer after reset
  }, []);

  useEffect(() => {
    let animationFrameId: number;
    let lastUpdateTime: number | null = null;

    const updateTimer = (currentTime: number) => {
      if (lastUpdateTime === null) {
        lastUpdateTime = currentTime;
      }

      const deltaTime = currentTime - lastUpdateTime;

      if (deltaTime >= 1000) {
        // Update every second
        setTimeLeft((prevTime) => {
          if (prevTime === null || prevTime <= 0) {
            setIsRunning(false);
            setIsPaused(false);
            toast.success("Timer completed");
            return null;
          }
          return prevTime - 1;
        });
        lastUpdateTime = currentTime;
      }

      if (isRunning && !isPaused) {
        animationFrameId = requestAnimationFrame(updateTimer);
      }
    };

    if (isRunning && !isPaused) {
      animationFrameId = requestAnimationFrame(updateTimer);
    }

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [isRunning, isPaused]);

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
        <span className="font-bold dark:text-stone-300">CodeBlitz</span>
      </div>

      <div className="flex items-center gap-1">
        <div
          className="flex gap-2 group dark:bg-zinc-800 dark:text-zinc-400 cursor-pointer bg-zinc-200 rounded-sm text-xs p-2 items-center"
          aria-label="timer controls"
        >
          {!isRunning ? (
            <IoAlarmOutline
              className="group-hover:animate-pulse"
              size={20}
              onClick={startTimer}
              title="Start Timer"
            />
          ) : (
            <>
              <MdAlarmOff
                size={20}
                className="text-red-500"
                onClick={cancelTimer}
                title="Cancel Timer"
              />
              {isPaused ? (
                <MdOutlinePlayCircleOutline
                  size={20}
                  onClick={resumeTimer}
                  title="Resume Timer"
                />
              ) : (
                <MdOutlinePauseCircleOutline
                  size={20}
                  onClick={pauseTimer}
                  title="Pause Timer"
                />
              )}
            </>
          )}
          {timeLeft !== null && <span>{formatTime(timeLeft)}</span>}
          {isRunning && (
            <LuRefreshCw
              size={16}
              title="Reset Timer"
              onClick={resetTimer}
              className="cursor-pointer hover:text-blue-500 transition-colors"
            />
          )}
        </div>
      </div>

      <div className="flex gap-4 items-center">
        <>
          {theme === "dark" ? (
            <MdDarkMode
              className="text-gray-600 cursor-pointer"
              size={20}
              onClick={toggleTheme}
            />
          ) : (
            <BsSun
              className="text-amber-400 cursor-pointer"
              size={20}
              onClick={toggleTheme}
            />
          )}
        </>
        <UserDropdownMenu />

      </div>
    </aside>
  );
};

export default TopBar;
