"use client";
import { problemSchema } from "@/core/types/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

type ProblemSchemaType = z.infer<typeof problemSchema>;

interface UpdateProblemSchemaType
  extends Omit<ProblemSchemaType, "inputUrl" | "outputUrl"> {
  id: string;
  inputUrl: string;
  outputUrl: string;
}

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { updateDashboardProblem } from "@/core/actions/dashboard";
import { getProblemData } from "@/core/actions/problem";
import { NewTopic, TopicList } from "@/core/actions/topics";
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

export const UpdateProblem = ({ id }: { id: string }) => {
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
  } = useForm<UpdateProblemSchemaType>({
    resolver: zodResolver(
      problemSchema.extend({
        id: z.string(),
        inputUrl: z.string().optional(),
        outputUrl: z.string().optional(),
      }),
    ),
    defaultValues: { id },
    mode: "all",
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
    const fetchData = async () => {
      const { newtopicList, message: topicMessage } = await TopicList();
      const result = await getProblemData(id);

      if ("error" in result) {
        toast.error(result.error || "Failed to fetch problem data");
        return;
      }

      const problem = result.problem;

      if (!newtopicList || topicMessage || !problem) {
        toast.error(topicMessage || "Failed to fetch data");
        return;
      }

      const topicNames = problem.topics.map((pt: any) => pt.topic.name);
      const hintNames = problem.hints.map((pt: any) => pt.name);
      const constraintNames = problem.constraints.map((pt: any) => pt.name);

      reset({
        id,
        title: problem.title,
        description: problem.description,
        difficulty: problem.difficulty,
        topics: topicNames.map((topic: string) => ({ topic })),
        hints: hintNames.map((hint: string) => ({ hint })),
        constraints: constraintNames.map((constraint: string) => ({
          constraint,
        })),
        driverFunction: {
          cplusplus: problem.cppDriver,
          python: problem.pythonDriver,
          javascript: problem.jsDriver,
        },
        inputUrl: problem.inputs || undefined,
        outputUrl: problem.outputs || undefined,
      });

      setInputUrl(problem.inputs);
      setOutputUrl(problem.outputs);
      setTopicList([...newtopicList, "others"]);
    };
    fetchData();
  }, [id, reset]);

  useEffect(() => {
    const uniqueTopics = Array.from(
      new Set(topicFields.map((t) => t.topic)),
    ).map((topic) => ({ topic }));
    if (uniqueTopics.length !== topicFields.length) {
      replaceTopic(uniqueTopics);
    }
  }, [topicFields, replaceTopic]);

  // Helper functions
  const isSubmittable = () => {
    const formValues = getValues();
    return (
      isValid &&
      (!!inputUrl || !!formValues.inputUrl) &&
      (!!outputUrl || !!formValues.outputUrl)
    );
  };

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  // Event handlers
  const onSubmit = async (formData: UpdateProblemSchemaType) => {
    if (!isSubmittable()) {
      toast.error("Please ensure all required fields are filled");
      return;
    }

    setIsLoading(true);

    // Use existing URLs if no new file was uploaded
    const updatedFormData = {
      ...formData,
      inputUrl: inputUrl || formData.inputUrl,
      outputUrl: outputUrl || formData.outputUrl,
    };

    try {
      const result = await updateDashboardProblem(updatedFormData);
      if ("error" in result) {
        toast.error(result.error);
      } else {
        toast.success(result.message);
      }
    } catch (error) {
      console.error("Error updating problem:", error);
      toast.error("An error occurred while updating the problem");
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
    file: File,
    setUrl: React.Dispatch<React.SetStateAction<string | null>>,
    fieldName: "inputUrl" | "outputUrl",
  ) => {
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
          <h2 className="text-2xl font-bold">Update Problem</h2>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? <Loader className="h-4 w-4 animate-spin" /> : "Update"}
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

        <div className="flex flex-col gap-2 justify-between">
          <Label htmlFor="inputFile">Input File</Label>
          <div className="flex gap-x-4 items-center">
            <div className="flex-1 truncate">
              {inputUrl ? `Current file: ${inputUrl}` : "No file uploaded"}
            </div>
            <Button
              type="button"
              onClick={() => {
                const fileInput = document.getElementById(
                  "inputFile",
                ) as HTMLInputElement;
                if (fileInput) {
                  fileInput.click();
                }
              }}
              className="w-40"
            >
              {inputUrl ? "Change Input" : "Upload Input"}
            </Button>
          </div>
          <Input
            id="inputFile"
            type="file"
            className="hidden"
            onChange={(e) => {
              handleFileSelect(e, setInputFile);
              if (e.target.files && e.target.files[0]) {
                uploadFile(e.target.files[0], setInputUrl, "inputUrl");
              }
            }}
            disabled={isInputUploading}
          />
          {isInputUploading && <p>Uploading...</p>}
        </div>

        {/* Output File Upload */}
        <div className="flex flex-col gap-2 justify-between">
          <Label htmlFor="outputFile">Output File</Label>
          <div className="flex gap-x-4 items-center">
            <div className="flex-1 truncate">
              {outputUrl ? `Current file: ${outputUrl}` : "No file uploaded"}
            </div>
            <Button
              type="button"
              onClick={() => {
                const fileInput = document.getElementById(
                  "outputFile",
                ) as HTMLInputElement;
                if (fileInput) {
                  fileInput.click();
                }
              }}
              className="w-40"
            >
              {outputUrl ? "Change Output" : "Upload Output"}
            </Button>
          </div>
          <Input
            id="outputFile"
            type="file"
            className="hidden"
            onChange={(e) => {
              handleFileSelect(e, setOutputFile);
              if (e.target.files && e.target.files[0]) {
                uploadFile(e.target.files[0], setOutputUrl, "outputUrl");
              }
            }}
            disabled={isOutputUploading}
          />
          {isOutputUploading && <p>Uploading...</p>}
        </div>
      </form>
    </div>
  );
};
