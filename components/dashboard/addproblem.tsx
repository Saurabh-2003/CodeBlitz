"use client";
import React, { useState, useOptimistic, useRef } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { problemSchema } from "@/core/types/types";
import { useFieldArray } from "react-hook-form";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "../ui/hover-card";
import { ScrollArea } from "../ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Difficulty } from "@prisma/client";
import { UserDetail } from "@/core";
import { NewProblem } from "@/core/actions/problem/newproblem";

interface ProblemSchemaType extends z.infer<typeof problemSchema> {}

export const AddProblem = () => {
  const {
    control,
    register,
    getValues,
    setValue,
    handleSubmit,
    formState: { errors, isLoading, isDirty, isValid },
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

  const isSubmittable = !!isDirty && !!isValid;

  const onSubmit = async (formdata: any) => {
    console.log(formdata, "form submitted");
    const result = await NewProblem(formdata);
    console.log(result);
  };
  if (errors) {
    console.log(errors);
  }

  const formRef = useRef();
  const [optimisticMessages, addOptimisticMessage] = useOptimistic(
    (state: any, newMessage: String[]) => [
      ...state,
      {
        text: newMessage,
        sending: true,
      },
    ],
  );

  async function formAction(formData: any) {
    addOptimisticMessage(formData.get("message"));

    await UserDetail();
  }

  return (
    <div className="w-full h-full items-center justify-center p-8 max-md:p-6 max-sm:p-2">
      <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-4">
        <div className="flex items-center justify-between mb-10 bg-zinc-200 p-4 rounded-md border border-zinc-400">
          <h2 className="text-xl">Create Problem</h2>
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
        </div>
        <div className="w-full">
          <Label>Description</Label>
          <Textarea
            className=" focus-visible:ring-0"
            placeholder="Description"
            {...register("description")}
          />
        </div>
        <div className="w-full space-y-2">
          <Label>Difficulty</Label>
          <Select onValueChange={(e: Difficulty) => setValue("difficulty", e)}>
            <SelectTrigger className="w-[180px] focus-visible:ring-0">
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

        <div>
          <Label>Topics</Label>
          <div className="flex gap-x-4 items-center">
            <Input
              className="w-full focus-visible:ring-0"
              type="text"
              placeholder="Topics"
              {...register("topics")}
            />
            {/* <Button
                type="submit"
                variant="outline"
                className="hover:bg-gray-100"
              >
                Add
              </Button> */}
          </div>
        </div>

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
        </div>
        <div className="w-full space-y-2">
          <div className="flex gap-x-4 items-center justify-between">
            <Label>Constraint </Label>
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
        </div>

        <div className="w-full space-y-2">
          <div className="flex gap-x-4 items-center justify-between">
            <Label>Inputs</Label>
          </div>
        </div>

        {/* <div>{errors.map((error, index))}</div> */}
      </form>
    </div>
  );
};
