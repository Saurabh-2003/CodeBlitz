"use server";

import { db } from "@/core/db/db";

export async function dashboardDeleteSingleUser(userEmail: string) {
  try {
    console.log(userEmail);
    await db.user.delete({
      where: {
        email: userEmail,
      },
    });
    return { success: true, message: "User deleted successfully." };
  } catch (error) {
    console.error("Error deleting user:", error);
    return {
      success: false,
      message: "Unable to delete user. Please try again.",
    };
  }
}
