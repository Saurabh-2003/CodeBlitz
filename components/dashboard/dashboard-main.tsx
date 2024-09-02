"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getDashboardData } from "@/core/actions/dashboard/get-dashboard-data";
import { Activity, ArrowUpRight, Users } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { IoCreateOutline } from "react-icons/io5";
import { SiThealgorithms } from "react-icons/si";
import { Badge } from "../ui/badge";

// Define types for the data
interface Problem {
  title: string;
  createdAt: Date;
  difficulty: string;
}

interface User {
  name: string | null;
  email: string | null;
  createdAt: Date;
  image: string | null;
}

interface DashboardData {
  totalUsers: number;
  totalActiveUsers: number;
  totalProblems: number;
  totalAdmins: number;
  recentProblems: Problem[];
  recentUsers: User[];
}
const difficultyColors = new Map<string, string>([
  ["EASY", "bg-green-100 text-green-800 hover:bg-green-100"],
  [
    "MEDIUM",
    "bg-amber-200/50 dark:text-yellow-400 text-yellow-500 hover:bg-amber-200/50",
  ],
  ["HARD", "bg-red-100 text-red-800 hover:bg-red-100"],
]);
export default function DashboardMain() {
  const [data, setData] = useState<DashboardData>({
    totalUsers: 0,
    totalActiveUsers: 0,
    totalProblems: 0,
    totalAdmins: 0,
    recentProblems: [],
    recentUsers: [],
  });

  useEffect(() => {
    async function fetchData() {
      const dashboardData = await getDashboardData();
      setData(dashboardData);
    }

    fetchData();
  }, []);

  return (
    <>
      <main className="flex flex-1 flex-col gap-4 md:gap-8">
        <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Problems
              </CardTitle>
              <SiThealgorithms className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.totalProblems}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.totalUsers}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Users
              </CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.totalActiveUsers}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Problem Authors
              </CardTitle>
              <IoCreateOutline className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.totalAdmins}</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
          <Card className="xl:col-span-2">
            <CardHeader className="flex flex-row items-center">
              <div className="grid gap-2">
                <CardTitle>Recently Added Problems</CardTitle>
                <CardDescription>
                  Recent problems added to the platform.
                </CardDescription>
              </div>
              <Button asChild size="sm" className="ml-auto gap-1">
                <Link href="/dashboard/problems">
                  View All
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Problem</TableHead>
                    <TableHead>Date Added</TableHead>
                    <TableHead>Difficulty</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.recentProblems.map((problem, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <div className="font-medium">{problem?.title}</div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-muted-foreground">
                          {new Date(problem.createdAt).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell className="text-xs">
                        <Badge
                          className={difficultyColors.get(problem.difficulty)}
                        >
                          {problem.difficulty}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent New Users</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-8">
              {data.recentUsers.map((user, index) => (
                <div className="flex items-center gap-4" key={index}>
                  <Avatar className="hidden h-9 w-9 sm:flex">
                    <AvatarImage
                      src={user?.image || "/placeholder.png"}
                      alt="Avatar"
                    />
                    <AvatarFallback>
                      {user?.name && user?.name[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid gap-1">
                    <p className="text-sm font-medium leading-none">
                      {user.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}
