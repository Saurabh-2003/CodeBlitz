"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { BiTrash } from "react-icons/bi";
import { CgLink } from "react-icons/cg";
import { FaGithub, FaLinkedin } from "react-icons/fa";

export default function UpdateProfileDialogue({ user }: any) {
  // Initialize state with user props or default values
  const [skills, setSkills] = useState<string[]>(
    user?.skills || ["React", "JavaScript"],
  );
  const [previewImage, setPreviewImage] = useState<string | null>(
    user?.image || null,
  );
  const [organization, setOrganization] = useState(user?.collageName || "");
  const [socialLinks, setSocialLinks] = useState({
    linkedin: user?.socialLinks?.linkedin || "",
    portfolio: user?.socialLinks?.portfolio || "",
    github: user?.socialLinks?.github || "",
  });

  const addSkill = () => {
    setSkills([...skills, ""]);
  };

  const removeSkill = (index: number) => {
    const updatedSkills = [...skills];
    updatedSkills.splice(index, 1);
    setSkills(updatedSkills);
  };

  const updateSkill = (index: number, value: string) => {
    const updatedSkills = [...skills];
    updatedSkills[index] = value;
    setSkills(updatedSkills);
  };

  const handleProfileImageChange = (e: any) => {
    const file = e.target.files[0];
    setPreviewImage(URL.createObjectURL(file));
  };

  const handleOrganizationChange = (e: any) => {
    setOrganization(e.target.value);
  };

  const handleSocialLinkChange = (type: string, value: string) => {
    setSocialLinks((prevState) => ({
      ...prevState,
      [type]: value,
    }));
  };

  return (
    <Dialog defaultOpen>
      <DialogTrigger asChild>
        <button className="w-full text-green-500 p-2 mt-4 rounded-xl text-sm bg-emerald-500/10">
          Edit Profile
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>Update Profile</DialogTitle>
        </DialogHeader>
        <div className="grid gap-6 py-6 md:grid-cols-1">
          <div className="flex flex-col gap-4">
            <Label htmlFor="name">Name</Label>
            <Input id="name" defaultValue={user?.name} />
          </div>
          <div className="flex flex-col gap-4">
            <Label>Email</Label>
            <Input disabled={true} defaultValue={user?.email} />
          </div>
          <div className="flex flex-col gap-4">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              defaultValue={user?.bio}
              className="min-h-[100px]"
              placeholder="Enter your bio(optional)"
            />
          </div>
          <div className="flex flex-col gap-4">
            <Label htmlFor="organization">Organization</Label>
            <Input
              placeholder="Enter your college or organization you are assiciated with(optional)"
              id="organization"
              type="text"
              value={organization}
              onChange={handleOrganizationChange}
            />
          </div>
          <div className="flex flex-col gap-4">
            <Label htmlFor="profile-image">Profile Image</Label>
            <div className="flex items-center gap-4">
              <Avatar className="w-16 h-16">
                {previewImage ? (
                  <AvatarImage src={previewImage} alt="Profile Image" />
                ) : (
                  <AvatarImage src={user?.image} alt="Profile Image" />
                )}
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <Input
                id="profile-image"
                type="file"
                accept="image/*"
                onChange={handleProfileImageChange}
              />
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <Label htmlFor="skills">Skills</Label>
            <div className="space-y-2">
              <div className="max-h-[150px] overflow-auto rounded-md border">
                {skills.map((skill: string, index: number) => (
                  <div
                    key={index}
                    className="flex items-center justify-between gap-2 p-2"
                  >
                    <Input
                      id={`skills-${index}`}
                      type="text"
                      value={skill}
                      onChange={(e) => updateSkill(index, e.target.value)}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeSkill(index)}
                    >
                      <BiTrash size={20} />
                    </Button>
                  </div>
                ))}
              </div>
              <Button variant="outline" size="sm" onClick={addSkill}>
                Add Skill
              </Button>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <Label htmlFor="social-links">Social Links</Label>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <FaLinkedin size={25} />
                <Input
                  id="linkedin-url"
                  type="text"
                  value={socialLinks.linkedin}
                  onChange={(e) =>
                    handleSocialLinkChange("linkedin", e.target.value)
                  }
                  placeholder="LinkedIn URL (optional)"
                />
              </div>
              <div className="flex items-center gap-2">
                <CgLink size={25} />
                <Input
                  id="portfolio-url"
                  type="text"
                  value={socialLinks.portfolio}
                  onChange={(e) =>
                    handleSocialLinkChange("portfolio", e.target.value)
                  }
                  placeholder="Portfolio URL (optional)"
                />
              </div>
              <div className="flex items-center gap-2">
                <FaGithub size={25} />
                <Input
                  id="github-url"
                  type="text"
                  value={socialLinks.github}
                  onChange={(e) =>
                    handleSocialLinkChange("github", e.target.value)
                  }
                  placeholder="GitHub URL (optional)"
                />
              </div>
            </div>
          </div>
        </div>
        <DialogFooter className="w-full">
          <Button
            type="submit"
            className="w-full bg-emerald-500/20 text-emerald-500 hover:bg-emerald-500/30 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
