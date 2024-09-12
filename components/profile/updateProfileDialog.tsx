"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { UserUpdate } from "@/core/actions/user";
import { useEffect, useState } from "react";
import { BiTrash } from "react-icons/bi";
import { CgLink } from "react-icons/cg";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { toast } from "sonner";

export default function UpdateProfileDialogue({ user, isOpen, onClose }: any) {
  const [previewImage, setPreviewImage] = useState<string>(user?.image || "");
  const [organization, setOrganization] = useState<string>(
    user?.collegeName || "",
  );
  const [skills, setSkills] = useState<string[]>(
    user?.skills ? user.skills.split(",") : [],
  );
  const [socialLinks, setSocialLinks] = useState({
    linkedin: user?.linkedinUrl || "",
    portfolio: user?.portfolioUrl || "",
    github: user?.githubUrl || "",
  });
  const [name, setName] = useState<string>(user?.name || "");
  const [bio, setBio] = useState<string>(user?.bio || "");
  const [base64Image, setBase64Image] = useState<string | undefined>(undefined);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setPreviewImage(user?.image || "");
    setSkills(user?.skills ? user.skills.split(",") : []);
    setSocialLinks({
      linkedin: user?.linkedinUrl || "",
      portfolio: user?.portfolioUrl || "",
      github: user?.githubUrl || "",
    });
    setName(user?.name || "");
    setBio(user?.bio || "");
    setOrganization(user?.collegeName || "");
  }, [user]);

  const addSkill = () => setSkills([...skills, ""]);

  const removeSkill = (index: number) => {
    setSkills(skills.filter((_, i) => i !== index));
  };

  const updateSkill = (index: number, value: string) => {
    const updatedSkills = [...skills];
    updatedSkills[index] = value;
    setSkills(updatedSkills);
  };

  const handleProfileImageChange = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setBase64Image(base64String);
        setPreviewImage(URL.createObjectURL(file));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSocialLinkChange = (type: string, value: string) => {
    setSocialLinks((prev) => ({
      ...prev,
      [type]: value,
    }));
  };

  const handleUpdateClick = async () => {
    setIsSaving(true);

    const skillsString = skills.join(",");
    const data = {
      name,
      bio: bio || "",
      socialLinks,
      skills: skillsString,
      collegeName: organization,
      previewImage: base64Image,
    };

    try {
      const result = await UserUpdate(data);
      if (result?.error) {
        toast.error(result?.message);
      } else if (result?.success) {
        toast.success("Profile Updated Successfully");
      }
    } catch (error) {
      console.error("Error saving profile:", error);
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    return () => {
      if (previewImage) {
        URL.revokeObjectURL(previewImage);
      }
    };
  }, [previewImage]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>Update Profile</DialogTitle>
        </DialogHeader>
        <div className="grid gap-6 py-6 md:grid-cols-1">
          <div className="flex flex-col gap-4">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isSaving}
            />
          </div>
          <div className="flex flex-col gap-4">
            <Label>Email</Label>
            <Input disabled defaultValue={user?.email} />
          </div>
          <div className="flex flex-col gap-4">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="min-h-[100px]"
              placeholder="Enter your bio (optional)"
              disabled={isSaving}
            />
          </div>
          <div className="flex flex-col gap-4">
            <Label htmlFor="organization">Organization</Label>
            <Input
              id="organization"
              value={organization}
              onChange={(e) => setOrganization(e.target.value)}
              placeholder="Enter your college or organization (optional)"
              disabled={isSaving}
            />
          </div>
          <div className="flex flex-col gap-4">
            <Label htmlFor="profile-image">Profile Image</Label>
            <div className="flex items-center gap-4">
              <Avatar className="w-16 h-16">
                <AvatarImage src={previewImage} alt="userImage" />
                <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
              </Avatar>
              <Input
                id="profile-image"
                type="file"
                accept="image/*"
                onChange={handleProfileImageChange}
                disabled={isSaving}
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
                      disabled={isSaving}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeSkill(index)}
                      disabled={isSaving}
                    >
                      <BiTrash size={20} />
                    </Button>
                  </div>
                ))}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={addSkill}
                disabled={isSaving}
              >
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
                  disabled={isSaving}
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
                  disabled={isSaving}
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
                  disabled={isSaving}
                />
              </div>
            </div>
          </div>
        </div>
        <DialogFooter className="w-full">
          <Button
            onClick={handleUpdateClick}
            className="w-full bg-emerald-500/20 text-emerald-500 hover:bg-emerald-500/30 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
            disabled={isSaving}
          >
            {isSaving ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
