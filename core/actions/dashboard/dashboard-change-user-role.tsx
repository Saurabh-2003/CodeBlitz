"use server";
import { db } from "@/core/db/db";

// Define your Role enum
enum UserRole {
  USER = "USER",
  ADMIN = "ADMIN",
  SUPERADMIN = "SUPERADMIN",
}

// function isUserRole(value: any): value is UserRole {
//   return Object.values(UserRole).includes(value);
// }

function isUserRole(value: string): value is UserRole {
  return Object.values(UserRole).includes(value as UserRole);
}

export async function dashboardChangeUserRole(userId: string, newRole: string) {
  try {
    const enumRole = newRole as UserRole;

    if (!isUserRole(enumRole)) {
      return { success: false, message: "Invalid role specified." };
    }

    await db.user.update({
      where: {
        id: userId,
      },
      data: {
        role: enumRole,
      },
    });

    return { success: true, message: "User role updated successfully." };
  } catch (error) {
    console.error("Error changing user role:", error);
    return {
      success: false,
      message: "Unable to change user role. Please try again.",
    };
  }
}
