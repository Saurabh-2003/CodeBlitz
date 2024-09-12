"use server";
// app/actions/dashboardData.ts
import { db } from "@/core/db/db";

export async function getDashboardData() {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  // Get total users count
  const totalUsers = await db.user.count();

  // Get total active users count (users who have submissions in the last 30 days)
  const totalActiveUsers = await db.user.count({
    where: {
      submissions: {
        some: {
          createdAt: { gte: thirtyDaysAgo },
        },
      },
    },
  });

  // Get total problems count
  const totalProblems = await db.problem.count();

  // Get total admins count (problem authors)
  const totalAdmins = await db.user.count({
    where: { role: "ADMIN" },
  });

  // Get the last 10 recently added problems (name and date)
  const recentProblems = await db.problem.findMany({
    orderBy: { createdAt: "desc" },
    take: 10,
    select: {
      title: true,
      createdAt: true,
      difficulty: true,
    },
  });

  // Get the last 10 recently added users
  const recentUsers = await db.user.findMany({
    orderBy: { createdAt: "desc" },
    take: 10,
    select: {
      name: true,
      email: true,
      createdAt: true,
      image: true,
    },
  });

  return {
    totalUsers,
    totalActiveUsers,
    totalProblems,
    totalAdmins,
    recentProblems,
    recentUsers,
  };
}
