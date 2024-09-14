"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { createDashboardNewProblem } from "@/core/actions/dashboard";
import { NewTopic, TopicList } from "@/core/actions/topics";
import { problemSchema } from "@/core/types/types";
import { uploadToCloudinary } from "@/lib/uploadfile";
import { cn } from "@/lib/utils";
import { ScrollArea } from "../ui/scroll-area";

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Textarea } from "../ui/textarea";
type Difficulty = "EASY" | "MEDIUM" | "HARD";
interface ProblemSchemaType extends z.infer<typeof problemSchema> {}

export const AddProblem = () => {
  // State
  const [isTopicListOpen, setIsTopicListOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [isNewTopicInputOpen, setIsNewTopicInputOpen] = useState(false);
  const [topicList, setTopicList] = useState<string[]>([]);
  const [inputUrl, setInputUrl] = useState<string | null>(null);
  const [outputUrl, setOutputUrl] = useState<string | null>(null);
  const [inputFile, setInputFile] = useState<File | null>(null);
  const [outputFile, setOutputFile] = useState<File | null>(null);
  const [isInputUploading, setIsInputUploading] = useState(false);
  const [isOutputUploading, setIsOutputUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Form setup
  const {
    control,
    register,
    setValue,
    getValues,
    handleSubmit,
    formState: { errors, isDirty, isValid },
    reset,
    clearErrors,
  } = useForm<ProblemSchemaType>({
    resolver: zodResolver(problemSchema),
    defaultValues: {},
    mode: "all",
    shouldUnregister: true,
  });

  // Field arrays
  const {
    fields: hintFields,
    remove: removeHint,
    append: appendHint,
  } = useFieldArray({ control, name: "hints" });
  const {
    fields: constraintFields,
    remove: removeConstraint,
    append: appendConstraint,
  } = useFieldArray({ control, name: "constraints" });
  const {
    fields: topicFields,
    remove: removeTopic,
    append: appendTopic,
    replace: replaceTopic,
  } = useFieldArray({ control, name: "topics" });

  // Effects
  useEffect(() => {
    const fetchTopics = async () => {
      const { newtopicList, message } = await TopicList();
      if (!newtopicList || message) {
        toast.error(message);
        return;
      }
      setTopicList([...newtopicList, "others"]);
    };
    fetchTopics();
  }, []);

  useEffect(() => {
    const uniqueTopics = Array.from(
      new Set(topicFields.map((t) => t.topic)),
    ).map((topic) => ({ topic }));
    if (uniqueTopics.length !== topicFields.length) {
      replaceTopic(uniqueTopics);
    }
  }, [topicFields, replaceTopic]);

  // Helper functions
  const isSubmittable = () => isValid && inputUrl && outputUrl;

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  // Event handlers
  const onSubmit = async (formData: ProblemSchemaType) => {
    if (!isSubmittable()) {
      toast.error(
        "Please fix all errors and upload both files before submitting",
      );
      return;
    }

    setIsLoading(true);
    formData.inputUrl = inputUrl!;
    formData.outputUrl = outputUrl!;

    try {
      const { message, error } = await createDashboardNewProblem(formData);
      if (error) {
        toast.error(error);
        return;
      }

      if (message) {
        toast.success(message);
        reset();
        setInputUrl(null);
        setOutputUrl(null);
        setInputFile(null);
        setOutputFile(null);
      }
    } catch (error) {
      console.error("Error submitting problem:", error);
      toast.error("An error occurred while submitting the problem");
    } finally {
      setIsLoading(false);
    }
  };

  const handleTopicSelection = (item: string) => {
    if (item === "others") {
      setIsNewTopicInputOpen(true);
    } else {
      appendTopic({ topic: item });
    }
    setIsTopicListOpen(false);
  };

  const handleNewTopic = () => {
    setIsNewTopicInputOpen(false);
    if (inputValue) {
      appendTopic({ topic: inputValue });
      setTopicList((prev) => [...prev, inputValue]);
      NewTopic(inputValue);
      setInputValue("");
    }
  };

  const uploadFile = async (
    file: File | null,
    setUrl: React.Dispatch<React.SetStateAction<string | null>>,
    fieldName: "inputUrl" | "outputUrl",
  ) => {
    if (!file) return;

    const setLoading =
      fieldName === "inputUrl" ? setIsInputUploading : setIsOutputUploading;
    setLoading(true);

    try {
      const base64 = await convertToBase64(file);
      const response = await uploadToCloudinary(base64, file.name);

      if (response.success) {
        const url = response.result?.secure_url || "";
        setUrl(url);
        setValue(fieldName, url, { shouldValidate: true });
        toast.success("File Uploaded Successfully");
      } else {
        console.error("File upload failed:", response.error);
        toast.error("File upload failed");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error("Error uploading file");
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (
    e: React.ChangeEvent<HTMLInputElement>,
    setFile: React.Dispatch<React.SetStateAction<File | null>>,
  ) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  // Render
  return (
    <div className="w-full h-full antialiased items-center justify-center">
      <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-4">
        <div className="flex items-center justify-between mb-10 dark:bg-zinc-800 dark:border-zinc-600 bg-zinc-200 p-4 rounded-md border border-zinc-400">
          <h2 className="text-2xl font-bold">Create Problem</h2>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? <Loader className="h-4 w-4 animate-spin" /> : "Submit"}
          </Button>
        </div>

        {/* Title Field */}
        <div className="w-full">
          <Label>Title</Label>
          <Input
            className="focus-visible:ring-0"
            type="text"
            placeholder="Title"
            {...register("title")}
          />
          {errors?.title && (
            <p className="text-red-500 text-xs pt-2">{errors.title.message}</p>
          )}
        </div>

        {/* Description Field */}
        <div className="w-full">
          <Label>Description</Label>
          <Textarea
            className="focus-visible:ring-0"
            placeholder="Description"
            {...register("description")}
          />
          {errors?.description && (
            <p className="text-red-500 text-xs pt-2">
              {errors.description.message}
            </p>
          )}
        </div>

        {/* Difficulty Field */}
        <div className="w-full space-y-2">
          <Label>Difficulty</Label>
          <Select
            onValueChange={(e: Difficulty) => {
              setValue("difficulty", e, { shouldValidate: true });
              clearErrors("difficulty");
            }}
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
          {errors?.difficulty && (
            <p className="text-red-500 text-xs">{errors.difficulty.message}</p>
          )}
        </div>

        {/* Topics Field */}
        <div className="space-y-2">
          <Label>Topics</Label>
          <Command>
            <CommandInput
              id="input1"
              onClick={() => setIsTopicListOpen((prev) => !prev)}
              onBlur={() => setIsTopicListOpen(false)}
              placeholder="Search the topics from list"
            />
            <CommandList
              className={cn(
                `max-h-0 bg-white top-10`,
                isTopicListOpen && "max-h-100",
              )}
            >
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup heading="Topics">
                {topicList.map((item, index) => (
                  <CommandItem
                    key={index}
                    onSelect={() => handleTopicSelection(item)}
                    onMouseDown={() => {
                      handleTopicSelection(item);
                      setIsTopicListOpen(!isTopicListOpen);
                    }}
                  >
                    {item}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>

          {isNewTopicInputOpen && (
            <div className="flex gap-x-4 items-center">
              <Input
                className="w-full focus-visible:ring-0"
                type="text"
                placeholder="New Topic"
                onChange={(e) => setInputValue(e.target.value)}
              />
              <Button
                type="button"
                variant="outline"
                className="hover:bg-gray-100"
                onClick={handleNewTopic}
              >
                Add
              </Button>
            </div>
          )}

          <div className="flex gap-x-4">
            {topicFields.map((field, index) => (
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
            ))}
          </div>
          {errors?.topics && (
            <p className="text-red-500 text-xs">{errors.topics.message}</p>
          )}
        </div>

        {/* Hints Field */}
        <div className="w-full space-y-2">
          <div className="flex gap-x-4 items-center justify-between">
            <Label>Hints</Label>
            <Button type="button" onClick={() => appendHint({ hint: "" })}>
              Add
            </Button>
          </div>
          <ScrollArea className="max-h-96 w-full border p-4 h-fit">
            {hintFields.map((field, index) => (
              <div key={field.id} className="space-y-2">
                <Label>Hint {index + 1}</Label>
                <div className="w-full flex gap-x-4 h-16 items-center">
                  <div className="w-full">
                    <Input
                      type="text"
                      {...register(`hints.${index}.hint` as const)}
                      placeholder="Enter a hint..."
                      defaultValue={field.hint}
                      className="focus-visible:ring-0"
                    />
                    {errors?.hints?.[index]?.hint && (
                      <p className="text-red-500 text-xs">
                        {errors.hints[index]?.hint?.message}
                      </p>
                    )}
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => removeHint(index)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </ScrollArea>
          {errors?.hints && (
            <p className="text-red-500 text-xs">{errors.hints.message}</p>
          )}
        </div>

        {/* Constraints Field */}
        <div className="w-full space-y-2">
          <div className="flex gap-x-4 items-center justify-between">
            <Label>
              Constraints
              <span className="text-sm text-gray-500">
                {" "}
                (Use ^ for superscript, maintain consistent spacing)
              </span>
            </Label>
            <Button
              type="button"
              onClick={() => appendConstraint({ constraint: "" })}
            >
              Add
            </Button>
          </div>
          <ScrollArea className="max-h-96 h-fit w-full border p-4">
            {constraintFields.map((field, index) => (
              <div key={field.id} className="space-y-2">
                <Label>Constraint {index + 1}</Label>
                <div className="w-full flex gap-x-4 h-16 items-center">
                  <div className="w-full">
                    <Input
                      type="text"
                      {...register(`constraints.${index}.constraint` as const)}
                      placeholder="Enter a constraint..."
                      defaultValue={field.constraint}
                      className="focus-visible:ring-0"
                    />
                    {errors?.constraints?.[index]?.constraint && (
                      <p className="text-red-500 text-xs">
                        {errors.constraints[index]?.constraint?.message}
                      </p>
                    )}
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => removeConstraint(index)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </ScrollArea>
          {errors?.constraints && (
            <p className="text-red-500 text-xs">{errors.constraints.message}</p>
          )}
        </div>

        {/* Driver Function Field */}
        <div className="w-full space-y-4">
          <Label>Driver Function</Label>
          <Tabs defaultValue="c++" className="w-full">
            <TabsList>
              <TabsTrigger
                className="data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-700"
                value="c++"
              >
                C++
              </TabsTrigger>
              <TabsTrigger
                className="data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-700"
                value="python"
              >
                Python
              </TabsTrigger>
              <TabsTrigger
                className="data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-700"
                value="javascript"
              >
                Javascript
              </TabsTrigger>
            </TabsList>
            <TabsContent value="c++">
              <Textarea
                className="min-h-[200px]"
                placeholder="Write C++ driver function here..."
                {...register("driverFunction.cplusplus")}
              />
              {errors?.driverFunction?.cplusplus && (
                <p className="text-red-500 text-xs">
                  {errors.driverFunction.cplusplus.message}
                </p>
              )}
            </TabsContent>
            <TabsContent value="python">
              <Textarea
                className="min-h-[200px]"
                placeholder="Write Python driver function here..."
                {...register("driverFunction.python")}
              />
              {errors?.driverFunction?.python && (
                <p className="text-red-500 text-xs">
                  {errors.driverFunction.python.message}
                </p>
              )}
            </TabsContent>
            <TabsContent value="javascript">
              <Textarea
                className="min-h-[200px]"
                placeholder="Write JavaScript driver function here..."
                {...register("driverFunction.javascript")}
              />
              {errors?.driverFunction?.javascript && (
                <p className="text-red-500 text-xs">
                  {errors.driverFunction.javascript.message}
                </p>
              )}
            </TabsContent>
          </Tabs>
        </div>

        {/* Input File Upload */}
        <div className="flex flex-col gap-2 justify-between">
          <Label htmlFor="inputFile">Input File</Label>
          <div className="flex gap-x-4">
            <Input
              id="inputFile"
              type="file"
              onChange={(e) => handleFileSelect(e, setInputFile)}
              disabled={isInputUploading}
            />
            <Button
              type="button"
              onClick={() => uploadFile(inputFile, setInputUrl, "inputUrl")}
              disabled={!inputFile || isInputUploading}
              className="w-40"
            >
              {isInputUploading ? (
                <Loader className="h-4 w-4 animate-spin" />
              ) : (
                "Upload Input"
              )}
            </Button>
          </div>
          {errors.inputUrl && (
            <p className="text-red-500 text-xs">{errors.inputUrl.message}</p>
          )}
        </div>

        {/* Output File Upload */}
        <div className="flex flex-col gap-2 justify-between">
          <Label htmlFor="outputFile">Output File</Label>
          <div className="flex gap-x-4">
            <Input
              id="outputFile"
              type="file"
              onChange={(e) => handleFileSelect(e, setOutputFile)}
              disabled={isOutputUploading}
            />
            <Button
              type="button"
              onClick={() => uploadFile(outputFile, setOutputUrl, "outputUrl")}
              disabled={!outputFile || isOutputUploading}
              className="w-40"
            >
              {isOutputUploading ? (
                <Loader className="h-4 w-4 animate-spin" />
              ) : (
                "Upload Output"
              )}
            </Button>
          </div>
          {errors.outputUrl && (
            <p className="text-red-500 text-xs">{errors.outputUrl.message}</p>
          )}
        </div>
      </form>
    </div>
  );
};
