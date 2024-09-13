"use server";

import { authOptions } from "@/core/auth/auth";
import { cloudinary } from "@/core/config/cloudinary";
import { db } from "@/core/db/db";
import { getServerSession } from "next-auth";
import { z } from "zod";

// Define schema with socialLinks as an object
const userSchema = z.object({
  name: z.string().optional(),
  bio: z.string().max(500).optional(),
  collegeName: z.string().optional(),
  socialLinks: z
    .object({
      linkedin: z.string().optional(),
      portfolio: z.string().optional(),
      github: z.string().optional(),
    })
    .optional(),
  skills: z.string().optional(),
  previewImage: z.string().optional(), // Include previewImage as optional
});

interface UserProp {
  name?: string;
  bio?: string;
  collegeName?: string;
  socialLinks?: {
    linkedin?: string;
    portfolio?: string;
    github?: string;
  };
  skills?: string;
  previewImage?: string;
}

export const UserUpdate = async (data: UserProp) => {
  try {
    const values = data;
    const session = await getServerSession(authOptions);
    const email = session?.user?.email;

    if (!email) {
      return { error: true, message: "User not logged in" };
    }

    // Validate the input values using Zod schema
    const validatedValues = userSchema.safeParse(values);
    if (!validatedValues.success) {
      // Log validation errors for better debugging
      console.log("Validation errors:", validatedValues.error.errors);
      return {
        error: true,
        message: "Invalid input",
        validationErrors: validatedValues.error.errors,
      };
    }

    // Fetch existing user data to check if the user with the given email exists
    const existingUser = await db.user.findUnique({
      where: { email },
    });

    if (!existingUser) {
      return { error: true, message: "User not found" };
    }

    let newImageUrl = existingUser.image; // Default to existing image URL

    // If previewImage is provided and it's not the same as the current image, handle the new image
    if (
      validatedValues.data.previewImage &&
      validatedValues.data.previewImage !== existingUser.image
    ) {
      // Assuming previewImage is base64, upload it to Cloudinary
      const uploadResult = await cloudinary.uploader.upload(
        validatedValues.data.previewImage,
        {
          folder: "user_images",
        },
      );

      newImageUrl = uploadResult.secure_url; // Use Cloudinary's returned URL
    }

    // Update user details in the database
    const updatedUser = await db.user.update({
      where: { email },
      data: {
        name: validatedValues.data.name,
        bio: validatedValues.data.bio,
        collegeName: validatedValues.data.collegeName,
        linkedinUrl: validatedValues.data.socialLinks?.linkedin, // Extract from socialLinks object
        portfolioUrl: validatedValues.data.socialLinks?.portfolio, // Extract from socialLinks object
        githubUrl: validatedValues.data.socialLinks?.github, // Extract from socialLinks object
        skills: validatedValues.data.skills,
        image: newImageUrl, // Update image field with new or existing URL
      },
    });

    return { success: true, user: updatedUser };
  } catch (error: unknown) {
    console.error("Error updating user:", error); // Log error
    return { error: true, message: "Internal server error" };
  }
};
