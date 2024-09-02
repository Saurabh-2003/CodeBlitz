/** eslint-disable no-unused-vars */
/** eslint-disable no-unused-vars */
"use client";
import { problemSchema } from "@/core/types/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

import { TopicList } from "@/core/actions";
import { NewProblem } from "@/core/actions/problem/newproblem";
import { NewTopic } from "@/core/actions/topics";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { ScrollArea } from "../ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
type Difficulty = "EASY" | "MEDIUM" | "HARD";
interface ProblemSchemaType extends z.infer<typeof problemSchema> {}

// const Constraint = ({ text }: { text: string }) => {
//   const renderText = (text: string) => {
//     const parts = text.split(/(\^\d+)/); // Split on superscript pattern
//     return parts.map((part, index) => {
//       if (part.startsWith("^")) {
//         return <sup key={index}>{part.slice(1)}</sup>;
//       }
//       return part;
//     });
//   };

//   return <div>{renderText(text)}</div>;
// };

export const AddProblem = () => {
  const [x, setx] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [openInput, setOpenInput] = useState(false);
  const [topicList, setTopic] = useState<string[]>([]);

  const {
    control,
    register,
    setValue,
    handleSubmit,
    // eslint-disable-next-line no-unused-vars
    formState: { errors, isDirty, isValid },
  } = useForm<ProblemSchemaType>({
    resolver: zodResolver(problemSchema),
    defaultValues: {},
  });

  const { fields, remove, append } = useFieldArray({
    control,
    name: "hints",
  });
  const {
    fields: constraintField,
    remove: removeConstrain,
    append: appendConstraint,
  } = useFieldArray({
    control,
    name: "constraints",
  });

  const {
    fields: topicField,
    remove: removeTopic,
    append: appendTopic,
    replace: replaceTopic,
  } = useFieldArray({
    control,
    name: "topics",
  });

  // const isSubmittable = !!isDirty && !!isValid;

  const onSubmit = async (formdata: any) => {
    console.log(formdata, "form submitted");
    const { message, error } = await NewProblem(formdata);
    if (error) {
      toast.error(error);
    }

    if (message) {
      toast.success(message);
    }
  };

  const selecttopic = (item: string) => {
    setx(false);
    if (item !== "others") {
      appendTopic({ topic: item });
    } else {
      setOpenInput(true);
    }
  };

  useEffect(() => {
    const uniqueTopicsSet = new Set(
      topicField.map((topicObj) => topicObj.topic),
    );
    const uniqueTopicsArray = Array.from(uniqueTopicsSet).map((topic) => ({
      topic,
    }));

    if (uniqueTopicsArray.length !== topicField.length) {
      replaceTopic(uniqueTopicsArray);
    }
  }, [topicField, replaceTopic]);

  const newTopic = () => {
    setOpenInput(false);
    if (inputValue !== "") {
      appendTopic({ topic: inputValue });
      setTopic((prev) => [...prev, inputValue]);
      NewTopic(inputValue);
      setInputValue("");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const { newtopicList, message } = await TopicList();
      if (!newtopicList || message) {
        toast.error(message);
        return;
      }
      const newData = [...newtopicList, "others"];

      setTopic(newData);
    };
    fetchData();
  }, [setTopic]);

  return (
    <div className="w-full h-full antialiased items-center justify-center">
      <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-4">
        <div className="flex items-center justify-between mb-10 bg-zinc-200 p-4 rounded-md border border-zinc-400">
          <h2 className="text-2xl font-bold">Create Problem</h2>
          <Button type="submit">
            <p>Submit</p>
            {/* {!isSubmittable && <p>(Disabled)</p>} */}
          </Button>
        </div>

        <div className="w-full">
          <Label>Title</Label>
          <Input
            className="focus-visible:ring-0"
            type="text"
            placeholder="Title"
            {...register("title")}
          />
          <ul>
            {errors?.title && (
              <p className="text-red-500 text-xs pt-2">
                {errors?.title?.message}
              </p>
            )}
          </ul>
        </div>
        <div className="w-full">
          <Label>Description</Label>
          <Textarea
            className=" focus-visible:ring-0"
            placeholder="Description"
            {...register("description")}
          />
          <ul>
            {errors?.description && (
              <p className="text-red-500 text-xs pt-2">
                {errors?.description?.message}
              </p>
            )}
          </ul>
        </div>
        <div className="w-full space-y-2">
          <Label>Difficulty</Label>
          <div className=" w-full">
            <Select
              onValueChange={(e: Difficulty) => setValue("difficulty", e)}
            >
              <SelectTrigger className="w-full focus-visible:ring-0">
                <SelectValue
                  className="focus-visible:ring-0"
                  placeholder="Difficulty"
                />
              </SelectTrigger>
              <SelectContent className="focus-visible:ring-0">
                <SelectItem value="EASY">Easy</SelectItem>
                <SelectItem value="MEDIUM">Medium</SelectItem>
                <SelectItem value="HARD">Hard</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <ul>
            {errors?.difficulty && (
              <p className="text-red-500 text-xs">
                {errors?.difficulty?.message}
              </p>
            )}
          </ul>
        </div>

        <div className="space-y-2">
          <Label>Topics</Label>
          <Command>
            <CommandInput
              id="input1"
              onClick={() => setx((prev) => !prev)}
              onBlur={() => setx(false)}
              placeholder="Search the topics from  list"
            />

            <CommandList
              className={cn(`max-h-0 bg-white top-10`, x && "max-h-100")}
            >
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup heading="Topics">
                {topicList.length >= 1 &&
                  topicList.map((item, index) => {
                    return (
                      <CommandItem
                        key={index}
                        onSelect={() => selecttopic(item)}
                        onMouseDown={() => {
                          selecttopic(item);
                          setx(!x);
                        }}
                      >
                        {item}
                      </CommandItem>
                    );
                  })}
              </CommandGroup>
            </CommandList>
          </Command>

          {openInput && (
            <div className="flex gap-x-4 items-center">
              <Input
                className="w-full focus-visible:ring-0"
                type="text"
                placeholder="Topics"
                onChange={(e) => setInputValue(e.target.value)}
              />
              <Button
                type="submit"
                variant="outline"
                className="hover:bg-gray-100"
                onClick={() => newTopic()}
              >
                Add
              </Button>
            </div>
          )}

          <div className="flex gap-x-4">
            {topicField.map((field, index) => {
              // eslint-disable-next-line no-unused-vars
              return (
                <div
                  key={index}
                  className="flex relative"
                  {...register(`topics.${index}.topic` as const)}
                >
                  <div className="flex text-xs capitalize px-3 py-1 text-[16px] text-zinc-800 bg-zinc-300/50 w-fit mb-2 rounded-md">
                    {field.topic}
                  </div>
                  <button
                    type="button"
                    className="absolute bg-rose-500 text-white rounded-full top-[-4px] right-[-5px] h-3 w-3 md:h-3 md:w-3"
                    onClick={() => removeTopic(index)}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Hints UI */}
        <div className="w-full space-y-2">
          <div className="flex gap-x-4 items-center justify-between">
            <Label>Hints </Label>
            <div className="flex items-center gap-4">
              <Button
                type="button"
                onClick={() =>
                  append({
                    hint: "",
                  })
                }
              >
                Add
              </Button>
            </div>
          </div>
          <ScrollArea className="max-h-96 w-full border p-4 h-fit ">
            {fields.map((field, index) => {
              const errorForField = errors?.hints?.[index]?.hint;
              return (
                <div key={index} className="space-y-2">
                  <Label>Hint{index + 1}</Label>
                  <div className="w-full flex gap-x-4 h-16 items-center">
                    <div className="w-full">
                      <Input
                        type="text"
                        {...register(`hints.${index}.hint` as const)}
                        placeholder="Enter a text.."
                        defaultValue={field.hint}
                        className="focus-visible:ring-0"
                      />
                      <p>{errorForField?.message ?? <>&nbsp;</>}</p>
                    </div>

                    <div className="h-full flex justify-start items-start">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => remove(index)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </ScrollArea>
          <ul>
            {errors?.hints && (
              <p className="text-red-500 text-xs">{errors?.hints?.message}</p>
            )}
          </ul>
        </div>

        <div className="w-full space-y-2">
          <div className="flex gap-x-4 items-center justify-between">
            <Label>
              <span>Constraints </span>
              <span>
                (Use {"^"} symbol to seperate superscript value and use
                consistent spacing.
              </span>
              )
            </Label>
            <div className="flex items-center gap-4">
              <Button
                type="button"
                onClick={() =>
                  appendConstraint({
                    constraint: "",
                  })
                }
              >
                Add
              </Button>
            </div>
          </div>
          <ScrollArea className="max-h-96 h-fit w-full border p-4">
            {constraintField.map((field, index) => {
              const errorForField = errors?.constraints?.[index]?.constraint;
              return (
                <div key={index} className="space-y-2">
                  <Label>Constraint{index + 1}</Label>
                  <div className="w-full flex gap-x-4 h-16 items-center">
                    <div className="w-full">
                      <Input
                        type="text"
                        {...register(
                          `constraints.${index}.constraint` as const,
                        )}
                        placeholder="Enter a text.."
                        defaultValue={field.constraint}
                        className="focus-visible:ring-0"
                      />
                      <p>{errorForField?.message ?? <>&nbsp;</>}</p>
                    </div>

                    <div className="h-full flex justify-start items-start">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => removeConstrain(index)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </ScrollArea>
          <ul>
            {errors?.constraints && (
              <p className="text-red-500 text-xs">
                {errors?.constraints?.message}
              </p>
            )}
          </ul>
        </div>

        <div className="w-full space-y-4">
          <div className="flex gap-x-4 items-center justify-between">
            <Label>Driver Function</Label>
          </div>
          <Tabs defaultValue="c++" className="w-full">
            <TabsList>
              <TabsTrigger value="c++">C++</TabsTrigger>
              <TabsTrigger value="python">Python</TabsTrigger>
              <TabsTrigger value="javascript">Javascript</TabsTrigger>
            </TabsList>
            <TabsContent value="c++">
              <Textarea
                className="min-h-[200px]"
                placeholder="Write c++ driver function here..."
                {...register("driverFunction.cplusplus")}
              />
            </TabsContent>

            <TabsContent value="python">
              <Textarea
                className="min-h-[200px]"
                placeholder="Write python driver function here..."
                {...register("driverFunction.python")}
              />
            </TabsContent>

            <TabsContent value="javascript">
              <Textarea
                className="min-h-[200px]"
                placeholder="Write javascript driver function here..."
                {...register("driverFunction.javascript")}
              />
            </TabsContent>
          </Tabs>
        </div>

        <div className="w-full space-y-2">
          <div className="flex gap-x-4 items-center justify-between">
            <Label>Inputs</Label>
          </div>
          <div className="w-full h-[100px]">space</div>
        </div>

        {/* <div>{errors.map((error, index))}</div> */}
      </form>
    </div>
  );
};
