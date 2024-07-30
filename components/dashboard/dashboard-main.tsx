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
import { Activity, ArrowUpRight, Users } from "lucide-react";
import Link from "next/link";
import { IoCreateOutline } from "react-icons/io5";
import { SiThealgorithms } from "react-icons/si";
export default function DashboardMain() {
  // Dummy data for recently added problems
  const recentProblems = [
    {
      name: "Two Sum",
      tags: ["Array", "Hash Table"],
      admin: {
        name: "Admin A",
        avatar: "/avatars/admin-a.png",
      },
    },
    {
      name: "Binary Tree Inorder Traversal",
      tags: ["Tree", "Depth-First Search"],
      admin: {
        name: "Admin B",
        avatar: "/avatars/admin-b.png",
      },
    },
    {
      name: "Longest Substring Without Repeating Characters",
      tags: ["String", "Sliding Window"],
      admin: {
        name: "Admin C",
        avatar: "/avatars/admin-c.png",
      },
    },
    {
      name: "Merge k Sorted Lists",
      tags: ["Linked List", "Heap"],
      admin: {
        name: "Admin D",
        avatar: "/avatars/admin-d.png",
      },
    },
    {
      name: "Word Ladder",
      tags: ["Breadth-First Search", "Graph"],
      admin: {
        name: "Admin E",
        avatar: "/avatars/admin-e.png",
      },
    },
    {
      name: "Clone Graph",
      tags: ["Depth-First Search", "Graph"],
      admin: {
        name: "Admin F",
        avatar: "/avatars/admin-f.png",
      },
    },
    {
      name: "Find Median from Data Stream",
      tags: ["Heap", "Design"],
      admin: {
        name: "Admin G",
        avatar: "/avatars/admin-g.png",
      },
    },
    {
      name: "Maximum Product Subarray",
      tags: ["Array", "Dynamic Programming"],
      admin: {
        name: "Admin H",
        avatar: "/avatars/admin-h.png",
      },
    },
    {
      name: "Search in Rotated Sorted Array",
      tags: ["Array", "Binary Search"],
      admin: {
        name: "Admin I",
        avatar: "/avatars/admin-i.png",
      },
    },
    {
      name: "Edit Distance",
      tags: ["String", "Dynamic Programming"],
      admin: {
        name: "Admin J",
        avatar: "/avatars/admin-j.png",
      },
    },
  ];

  // Dummy data for recent new users
  const recentUsers = [
    {
      name: "Olivia Martin",
      email: "olivia.martin@email.com",
      avatar: "/avatars/01.png",
    },
    {
      name: "Jackson Lee",
      email: "jackson.lee@email.com",
      avatar: "/avatars/02.png",
    },
    {
      name: "Emma Johnson",
      email: "emma.johnson@email.com",
      avatar: "/avatars/03.png",
    },
    {
      name: "Noah Williams",
      email: "noah.williams@email.com",
      avatar: "/avatars/04.png",
    },
    {
      name: "Ava Brown",
      email: "ava.brown@email.com",
      avatar: "/avatars/05.png",
    },
    {
      name: "Liam Jones",
      email: "liam.jones@email.com",
      avatar: "/avatars/06.png",
    },
    {
      name: "Sophia Garcia",
      email: "sophia.garcia@email.com",
      avatar: "/avatars/07.png",
    },
    {
      name: "Mason Rodriguez",
      email: "mason.rodriguez@email.com",
      avatar: "/avatars/08.png",
    },
    {
      name: "Isabella Martinez",
      email: "isabella.martinez@email.com",
      avatar: "/avatars/09.png",
    },
    {
      name: "James Hernandez",
      email: "james.hernandez@email.com",
      avatar: "/avatars/10.png",
    },
  ];

  return (
    <>
      <main className="flex flex-1 flex-col gap-4  md:gap-8">
        <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Problems
              </CardTitle>
              <SiThealgorithms className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,245</div>{" "}
              {/* Example Data */}
              <p className="text-xs text-muted-foreground">
                +15% from last month {/* Example Percentage */}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">5,300</div>{" "}
              {/* Example Data */}
              <p className="text-xs text-muted-foreground">
                +12.5% signed up last month {/* Example Percentage */}
              </p>
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
              <div className="text-2xl font-bold">2,435</div>{" "}
              {/* Example Data */}
              <p className="text-xs text-muted-foreground">
                +8% active today {/* Example Percentage */}
              </p>
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
              <div className="text-2xl font-bold">150</div> {/* Example Data */}
              <p className="text-xs text-muted-foreground">
                +5% added last month {/* Example Percentage */}
              </p>
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
                <Link href="#">
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
                    <TableHead>Admin</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentProblems.map((problem, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <div className="font-medium">{problem.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {problem.tags.join(", ")}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Avatar className="h-8 w-8">
                            <AvatarImage
                              src={problem.admin.avatar}
                              alt={problem.admin.name}
                            />
                            <AvatarFallback>
                              {problem.admin.name[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div className="ml-2">
                            {problem.admin.name.split(" ")[0]}
                          </div>
                        </div>
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
              {recentUsers.map((user, index) => (
                <div className="flex items-center gap-4" key={index}>
                  <Avatar className="hidden h-9 w-9 sm:flex">
                    <AvatarImage src={user.avatar} alt="Avatar" />
                    <AvatarFallback>{user.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="grid gap-1">
                    <p className="text-sm font-medium leading-none">
                      {user.name.split(" ")[0]}
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
