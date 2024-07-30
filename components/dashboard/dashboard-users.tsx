"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ListFilter, MoreHorizontal, Search } from "lucide-react";
import { useState } from "react";

// Mock data for users
const users = [
  {
    id: 1,
    name: "Jane Doe",
    email: "jane.doe@example.com",
    role: "Admin",
    image: "/path/to/user-image.jpg",
  },
  {
    id: 2,
    name: "John Smith",
    email: "john.smith@example.com",
    role: "User",
    image: "/path/to/user-image.jpg",
  },
  {
    id: 3,
    name: "Alice Johnson",
    email: "alice.johnson@example.com",
    role: "Moderator",
    image: "/path/to/user-image.jpg",
  },
  {
    id: 4,
    name: "Alice Johnson",
    email: "alice.johnson@example.com",
    role: "Moderator",
    image: "/path/to/user-image.jpg",
  },
  {
    id: 5,
    name: "Alice Johnson",
    email: "alice.johnson@example.com",
    role: "Moderator",
    image: "/path/to/user-image.jpg",
  },
  {
    id: 6,
    name: "Alice Johnson",
    email: "alice.johnson@example.com",
    role: "Moderator",
    image: "/path/to/user-image.jpg",
  },
  {
    id: 7,
    name: "Alice Johnson",
    email: "alice.johnson@example.com",
    role: "Moderator",
    image: "/path/to/user-image.jpg",
  },
  {
    id: 8,
    name: "Alice Johnson",
    email: "alice.johnson@example.com",
    role: "Moderator",
    image: "/path/to/user-image.jpg",
  },
  {
    id: 9,
    name: "Alice Johnson",
    email: "alice.johnson@example.com",
    role: "Moderator",
    image: "/path/to/user-image.jpg",
  },
  {
    id: 10,
    name: "Alice Johnson",
    email: "alice.johnson@example.com",
    role: "Moderator",
    image: "/path/to/user-image.jpg",
  },
];

export default function DashboardUsers() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("all");

  const filteredUsers = users
    .filter(
      (user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    .filter((user) => selectedRole === "all" || user.role === selectedRole);

  return (
    <main className="grid flex-1 items-start gap-4  md:gap-8">
      <Tabs defaultValue="all" onValueChange={setSelectedRole}>
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
              User
            </TabsTrigger>
            <TabsTrigger
              className=" dark:data-[state=active]:bg-zinc-600 dark:data-[state=active]:text-slate-300"
              value="medium"
            >
              Authors
            </TabsTrigger>
            <TabsTrigger
              className=" dark:data-[state=active]:bg-zinc-600 data-[state=active]:text-slate-300"
              value="hard"
            >
              Admins
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
            <div className="relative ml-auto flex-1 md:grow-0">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search..."
                className="w-44 focus-visible:ring-0 focus-visible:border-2 focus-visible:border-slate-300 rounded-lg bg-background pl-8 "
              />
            </div>
          </div>
        </div>
        <TabsContent value="all">
          <Card>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Image</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>
                      <span className="sr-only">Actions</span>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <Avatar>
                          <AvatarImage src={user.image} alt={user.name} />
                          <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                      </TableCell>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.role}</TableCell>
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
                            <DropdownMenuItem>Update Role</DropdownMenuItem>
                            <DropdownMenuItem>Delete User</DropdownMenuItem>
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
                Showing <strong>1-{filteredUsers.length}</strong> of{" "}
                <strong>{users.length}</strong> users
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </main>
  );
}
