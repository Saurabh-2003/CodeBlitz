import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ListFilter, MoreHorizontal, PlusCircle } from "lucide-react";

const problems = [
  {
    number: 1,
    name: "Two Sum",
    createdAt: "2024-01-01 12:00 AM",
    difficulty: "Easy",
    tags: ["Array", "HashTable"],
    author: {
      name: "Jane Doe",
      image: "/path/to/author-image.jpg",
    },
  },
  {
    number: 2,
    name: "Longest Substring Without Repeating Characters",
    createdAt: "2024-01-05 02:30 PM",
    difficulty: "Medium",
    tags: ["String", "Sliding Window"],
    author: {
      name: "John Smith",
      image: "/path/to/author-image.jpg",
    },
  },
  {
    number: 3,
    name: "Median of Two Sorted Arrays",
    createdAt: "2024-01-10 09:15 AM",
    difficulty: "Hard",
    tags: ["Array", "Binary Search"],
    author: {
      name: "Alice Johnson",
      image: "/path/to/author-image.jpg",
    },
  },
  {
    number: 4,
    name: "Valid Parentheses",
    createdAt: "2024-01-12 04:45 PM",
    difficulty: "Easy",
    tags: ["Stack", "String"],
    author: {
      name: "Emily Davis",
      image: "/path/to/author-image.jpg",
    },
  },
  {
    number: 5,
    name: "Merge Intervals",
    createdAt: "2024-01-15 11:30 AM",
    difficulty: "Medium",
    tags: ["Array", "Sorting"],
    author: {
      name: "Michael Brown",
      image: "/path/to/author-image.jpg",
    },
  },
  {
    number: 6,
    name: "Jump Game",
    createdAt: "2024-01-20 06:20 PM",
    difficulty: "Hard",
    tags: ["Array", "Dynamic Programming"],
    author: {
      name: "Linda White",
      image: "/path/to/author-image.jpg",
    },
  },
  {
    number: 7,
    name: "Word Break",
    createdAt: "2024-01-25 08:10 AM",
    difficulty: "Medium",
    tags: ["String", "Dynamic Programming"],
    author: {
      name: "David Wilson",
      image: "/path/to/author-image.jpg",
    },
  },
  {
    number: 8,
    name: "Climbing Stairs",
    createdAt: "2024-02-01 03:00 PM",
    difficulty: "Easy",
    tags: ["Dynamic Programming", "Math"],
    author: {
      name: "Sophia Martinez",
      image: "/path/to/author-image.jpg",
    },
  },
  {
    number: 9,
    name: "Decode Ways",
    createdAt: "2024-02-05 10:00 AM",
    difficulty: "Medium",
    tags: ["String", "Dynamic Programming"],
    author: {
      name: "Oliver Garcia",
      image: "/path/to/author-image.jpg",
    },
  },
  {
    number: 10,
    name: "Longest Palindromic Substring",
    createdAt: "2024-02-10 01:45 PM",
    difficulty: "Hard",
    tags: ["String", "Dynamic Programming"],
    author: {
      name: "Amelia Rodriguez",
      image: "/path/to/author-image.jpg",
    },
  },
];

const difficultyColors = new Map([
  ["Easy", "bg-green-100 text-green-800 hover:bg-green-100"],
  [
    "Medium",
    "bg-amber-200/50 dark:text-yellow-400 text-yellow-500 hover:bg-amber-200/50",
  ],
  ["Hard", "bg-red-100 text-red-800 hover:bg-red-100"],
]);

export default function DashboardProblems() {
  return (
    <main className="grid flex-1 items-start gap-4  md:gap-8">
      <Tabs defaultValue="all">
        <div className="flex items-center">
          <TabsList className="bg-white dark:bg-zinc-800">
            <TabsTrigger
              className=" dark:data-[state=active]:bg-zinc-600 dark:data-[state=active]:text-slate-300"
              value="all"
            >
              All
            </TabsTrigger>
            <TabsTrigger
              className=" dark:data-[state=active]:bg-zinc-600 dark:data-[state=active]:text-slate-300"
              value="easy"
            >
              Easy
            </TabsTrigger>
            <TabsTrigger
              className=" dark:data-[state=active]:bg-zinc-600 dark:data-[state=active]:text-slate-300"
              value="medium"
            >
              Medium
            </TabsTrigger>
            <TabsTrigger
              className=" dark:data-[state=active]:bg-zinc-600 dark:data-[state=active]:text-slate-300"
              value="hard"
            >
              Hard
            </TabsTrigger>
          </TabsList>
          <div className="ml-auto flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 gap-1">
                  <ListFilter className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Filter
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Easy</DropdownMenuItem>
                <DropdownMenuItem>Medium</DropdownMenuItem>
                <DropdownMenuItem>Hard</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button size="sm" variant="outline" className="h-8 gap-1">
              <PlusCircle className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Add Problem
              </span>
            </Button>
          </div>
        </div>
        <TabsContent value="all">
          <Card className="dark:bg-zinc-800">
            <CardHeader>
              <CardTitle>Problems</CardTitle>
              <CardDescription>
                Manage your problems and view their details.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Number</TableHead> {/* Added Number Header */}
                    <TableHead>Name</TableHead>
                    <TableHead>Created At</TableHead>
                    <TableHead>Difficulty</TableHead>
                    <TableHead>Tags</TableHead>
                    <TableHead>Author</TableHead>
                    <TableHead>
                      <span className="sr-only">Actions</span>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {problems.map((problem) => (
                    <TableRow key={problem.number}>
                      {" "}
                      {/* Use problem.number as key */}
                      <TableCell>{problem.number}</TableCell>{" "}
                      {/* Added Number Cell */}
                      <TableCell className="font-medium">
                        {problem.name}
                      </TableCell>
                      <TableCell>{problem.createdAt}</TableCell>
                      <TableCell>
                        <Badge
                          className={`${difficultyColors.get(problem?.difficulty)}`}
                        >
                          {problem.difficulty}
                        </Badge>
                      </TableCell>
                      <TableCell className=" space-y-2">
                        {problem.tags.slice(0, 2).map((tag) => (
                          <Badge
                            variant={"secondary"}
                            key={tag}
                            className="mr-1"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </TableCell>
                      <TableCell className="flex items-center gap-2">
                        <Avatar>
                          <AvatarImage
                            src={problem.author.image}
                            alt={problem.author.name}
                          />
                          <AvatarFallback>
                            {problem.author.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <span>{problem.author.name}</span>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              aria-haspopup="true"
                              size="icon"
                              variant="ghost"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Toggle menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem>Edit</DropdownMenuItem>
                            <DropdownMenuItem>Delete</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter>
              <div className="text-xs text-muted-foreground">
                Showing <strong>1-10</strong> of <strong>32</strong> problems
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </main>
  );
}
