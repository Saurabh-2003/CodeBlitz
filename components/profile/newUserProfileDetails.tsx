"use client";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
// import { SkillList } from "@/core/actions"; // Renamed from TopicList to SkillList
import { NewProblem } from "@/core/actions/problem/newproblem";
import { UpdateProfileSchema } from "@/core/types/types";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
interface ProfileSchemaType extends z.infer<typeof UpdateProfileSchema> {}

const NewUserProfileDetails = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [skills, setSkills] = useState<string[]>([]);

  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isDirty, isValid },
  } = useForm<ProfileSchemaType>({
    resolver: zodResolver(UpdateProfileSchema),
    defaultValues: {},
  });

  const { fields, remove, append } = useFieldArray({
    control,
    name: "skills",
  });

  const isSubmittable = isDirty && isValid;

  const onSubmit = async (formdata: any) => {
    console.log(formdata, "form submitted");
    const { message, error } = await NewProblem(formdata);
    if (error) {
      toast.error(error);
    } else if (message) {
      toast.success(message);
    }
  };

  const selectSkill = (skill: string) => {
    if (!fields.some((field) => field.skill === skill)) {
      append({ skill });
    }
    setIsDropdownOpen(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      // const { skillList, message } = await TopicList();
      // if (message) {
      //   toast.error(message);
      // } else {
      //   setSkills(skillList);
      // }
      setSkills(["dp", "web dev", "machine learning"]);
    };
    fetchData();
  }, []);

  return (
    <div className="w-full h-full antialiased items-center justify-center p-8 max-md:p-6 max-sm:p-2">
      <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-4">
        <div className="flex items-center justify-between mb-10 bg-zinc-200 p-4 rounded-md border border-zinc-400">
          <h2 className="text-2xl font-bold">User Details</h2>
          <Button type="submit" disabled={!isSubmittable}>
            <p>Update</p>
          </Button>
        </div>

        <div className="w-full">
          <Label>Username</Label>
          <Input
            className="focus-visible:ring-0"
            type="text"
            placeholder="Please create a username"
            {...register("username")}
          />
          {errors?.username && (
            <p className="text-red-500 text-xs">{errors?.username?.message}</p>
          )}
        </div>

        <div className="w-full">
          <Label>Organisation</Label>
          <Input
            className="focus-visible:ring-0"
            type="text"
            placeholder="Please enter your Organisation or College name (optional)"
            {...register("collegename")}
          />
          {errors?.collegename && (
            <p className="text-red-500 text-xs">
              {errors?.collegename?.message}
            </p>
          )}
        </div>

        <div className="w-full">
          <Label>Bio</Label>
          <Textarea
            className="focus-visible:ring-0"
            placeholder="Enter your bio (optional)"
            {...register("bio")}
          />
        </div>

        <div className="space-y-2">
          <Label>Skills</Label>
          <Command>
            <CommandInput
              id="input1"
              onClick={() => setIsDropdownOpen((prev) => !prev)}
              onBlur={() => setIsDropdownOpen(false)}
              placeholder="Search the skills from the list"
            />

            <CommandList
              className={cn(
                `max-h-0 bg-white top-10`,
                isDropdownOpen && "max-h-100",
              )}
            >
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup heading="Skills">
                {skills.map((skill, index) => (
                  <CommandItem
                    key={index}
                    onSelect={() => selectSkill(skill)}
                    onMouseDown={() => {
                      selectSkill(skill);
                      setIsDropdownOpen(false);
                    }}
                  >
                    {skill}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>

          <div className="flex gap-x-4 flex-wrap">
            {fields.map((field, index) => (
              <div key={field.id} className="flex items-center space-x-2 mb-2">
                <div className="flex text-xs capitalize px-3 py-1 text-[16px] text-zinc-800 bg-zinc-300/50 rounded-md">
                  {field.skill}
                </div>
                <button
                  type="button"
                  className="text-rose-500"
                  onClick={() => remove(index)}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </form>
    </div>
  );
};

export default NewUserProfileDetails;
