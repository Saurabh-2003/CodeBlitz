"use client";

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
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
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
import { deleteProblem } from "@/core/actions/problem/delete-problem";
import { getAdminAllProblems } from "@/core/actions/problem/get-admin-problems";
import { ListFilter, MoreHorizontal, PlusCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const difficultyColors = new Map<string, string>([
  ["EASY", "bg-green-100 text-green-800 hover:bg-green-100"],
  [
    "MEDIUM",
    "bg-amber-200/50 dark:text-yellow-400 text-yellow-500 hover:bg-amber-200/50",
  ],
  ["HARD", "bg-red-100 text-red-800 hover:bg-red-100"],
]);

interface ProblemWithTopics {
  id: string;
  title: string;
  createdAt: Date;
  difficulty: string;
  topics: string[];
}

export default function DashboardProblems() {
  const [problems, setProblems] = useState<ProblemWithTopics[]>([]);
  const [selectedProblem, setSelectedProblem] =
    useState<ProblemWithTopics | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  useEffect(() => {
    async function fetchProblems() {
      const { data, error } = await getAdminAllProblems();
      if (error) {
        toast.error(error);
      } else {
        setProblems(data ?? []);
      }
    }

    fetchProblems();
  }, []);

  const handleDelete = async () => {
    if (selectedProblem) {
      try {
        const {success, message, error} = await deleteProblem(selectedProblem.id)
        if(success){
          setProblems(
            problems.filter((problem) => problem.id !== selectedProblem.id),
          );
          setIsDeleteDialogOpen(false);
          toast.success(message)
        }else{
          toast.error(error)
        }

      } catch (error) {
        toast.error("Failed to delete the problem");
      }
    }
  };

  return (
    <main className="grid flex-1 items-start gap-4 md:gap-8">
      <Tabs defaultValue="all">
        <div className="flex items-center">
          <TabsList className="bg-white dark:bg-zinc-800">
            <TabsTrigger
              className="dark:data-[state=active]:bg-zinc-600 dark:data-[state=active]:text-slate-300"
              value="all"
            >
              All
            </TabsTrigger>
            <TabsTrigger
              className="dark:data-[state=active]:bg-zinc-600 dark:data-[state=active]:text-slate-300"
              value="easy"
            >
              Easy
            </TabsTrigger>
            <TabsTrigger
              className="dark:data-[state=active]:bg-zinc-600 dark:data-[state=active]:text-slate-300"
              value="medium"
            >
              Medium
            </TabsTrigger>
            <TabsTrigger
              className="dark:data-[state=active]:bg-zinc-600 dark:data-[state=active]:text-slate-300"
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
                    <TableHead>Number</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Created At</TableHead>
                    <TableHead>Difficulty</TableHead>
                    <TableHead>Topics</TableHead>
                    <TableHead>
                      <span className="sr-only">Actions</span>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {problems.map((problem, index) => (
                    <TableRow key={index}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell className="font-medium">
                        {problem.title}
                      </TableCell>
                      <TableCell>
                        {new Date(problem.createdAt).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={difficultyColors.get(problem.difficulty)}
                        >
                          {problem.difficulty}
                        </Badge>
                      </TableCell>
                      <TableCell className="space-y-2">
                        {problem.topics.slice(0, 2).map((topic, idx) => (
                          <Badge
                            variant={"secondary"}
                            key={idx}
                            className="mr-1"
                          >
                            {topic}
                          </Badge>
                        ))}
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
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedProblem(problem);
                                setIsDeleteDialogOpen(true);
                              }}
                            >
                              Delete
                            </DropdownMenuItem>
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
                Showing <strong>1-{problems.length}</strong> of{" "}
                <strong>{problems.length}</strong> problems
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>

      <DeleteProblemDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        selectedProblem={selectedProblem}
        onDelete={handleDelete}
      />
    </main>
  );
}

interface DeleteProblemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedProblem: ProblemWithTopics | null;
  onDelete: () => void;
}

function DeleteProblemDialog({
  open,
  onOpenChange,
  selectedProblem,
  onDelete,
}: DeleteProblemDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Problem</DialogTitle>
        </DialogHeader>
        <p>Are you sure you want to delete this problem?</p>
        <p>
          <strong>{selectedProblem?.title}</strong>
        </p>
        <div className="flex justify-end mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="destructive" className="ml-2" onClick={onDelete}>
            Delete
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}