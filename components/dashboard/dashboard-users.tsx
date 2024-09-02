"use client";
import { changeUserRole } from "@/core/actions/user/change-user-role";
import { deleteUser } from "@/core/actions/user/delete-single-user";
import { getAllUserDetails } from "@/core/actions/user/get-all-user-details";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { useEffect, useState } from "react";
import { FaTrash, FaUser } from "react-icons/fa";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { UserDataTable } from "./user-table";

// Define the User type
interface User {
  id: string;
  name: string | null;
  email: string | null;
  role: "USER" | "ADMIN" | "SUPERADMIN";
  image?: string | null;
}

// Define a separate type for columns with actions
type UserWithActions = User & { actions?: never };

// Create column helper
const columnHelper = createColumnHelper<UserWithActions>();

export default function DashboardUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [filters, setFilters] = useState({ role: "", search: "" });

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [roleToChange, setRoleToChange] = useState<
    "USER" | "ADMIN" | "SUPERADMIN" | null
  >(null);

  const [dialogType, setDialogType] = useState<"delete" | "changeRole" | null>(
    null,
  );

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { allUsers, error } = await getAllUserDetails();
        if (error) {
          toast.error(error);
          return;
        }
        setUsers(allUsers || []); // Ensure allUsers is not undefined
      } catch (error) {
        console.error("Failed to fetch users:", error);
        toast.error("An unexpected error occurred.");
      }
    };

    fetchUsers();
  }, []);

  const handleDeleteUser = async () => {
    if (selectedUser) {
      try {
        const result = await deleteUser(selectedUser.email);
        if (result.success) {
          setUsers((prevUsers) =>
            prevUsers.filter((user) => user.id !== selectedUser.id),
          );
          toast.success("User deleted successfully.");
        } else {
          toast.error(result.message || "An error occurred.");
        }
      } catch (error) {
        console.error("Error deleting user:", error);
        toast.error("An error occurred while deleting the user.");
      } finally {
        setDialogType(null);
      }
    }
  };

  const handleChangeRole = async () => {
    if (selectedUser && roleToChange) {
      try {
        const result = await changeUserRole(selectedUser.id, roleToChange);
        if (result.success) {
          setUsers((prevUsers) =>
            prevUsers.map((user) =>
              user.id === selectedUser.id
                ? {
                    ...user,
                    role: roleToChange as "USER" | "ADMIN" | "SUPERADMIN",
                  }
                : user,
            ),
          );
          toast.success("User role updated successfully.");
        } else {
          toast.error(result.message || "An error occurred.");
        }
      } catch (error) {
        console.error("Error changing user role:", error);
        toast.error("An error occurred while changing user role.");
      } finally {
        setDialogType(null);
      }
    }
  };

  const columns: ColumnDef<UserWithActions, any>[] = [
    columnHelper.accessor("image", {
      header: "Image",
      cell: (info) => (
        <Avatar>
          <AvatarImage src={info.getValue() || undefined} />
          <AvatarFallback>
            {info.row.original.name ? info.row.original.name[0] : "U"}
          </AvatarFallback>
        </Avatar>
      ),
    }),
    columnHelper.accessor("name", {
      header: "Name",
    }),
    columnHelper.accessor("email", {
      header: "Email",
    }),
    columnHelper.accessor("role", {
      header: "Role",
    }),
    columnHelper.accessor("actions", {
      header: "Actions",
      cell: (info) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Actions</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="gap-x-2"
              onClick={() => {
                setSelectedUser(info.row.original);
                setRoleToChange(info.row.original.role);
                setDialogType("changeRole");
              }}
            >
              <FaUser />
              <span>Change Role</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="gap-x-2"
              onClick={() => {
                setSelectedUser(info.row.original);
                setDialogType("delete");
              }}
            >
              <FaTrash />
              <span>Delete</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    }),
  ];

  return (
    <div>
      <UserDataTable
        columns={columns}
        data={users}
        filters={filters}
        onFilterChange={(newFilters) => setFilters(newFilters)}
      />

      {/* Dialog for Changing Role */}
      <ChangeRoleDialog
        open={dialogType === "changeRole"}
        onOpenChange={() => setDialogType(null)}
        selectedUser={selectedUser}
        roleToChange={roleToChange}
        setRoleToChange={setRoleToChange}
        onSave={handleChangeRole}
      />

      {/* Dialog for Deleting User */}
      <DeleteUserDialog
        open={dialogType === "delete"}
        onOpenChange={() => setDialogType(null)}
        selectedUser={selectedUser}
        onDelete={handleDeleteUser}
      />
    </div>
  );
}

interface ChangeRoleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedUser: User | null;
  roleToChange: "USER" | "ADMIN" | "SUPERADMIN" | null;
  setRoleToChange: (role: "USER" | "ADMIN" | "SUPERADMIN" | null) => void;
  onSave: () => void;
}

function ChangeRoleDialog({
  open,
  onOpenChange,
  selectedUser,
  roleToChange,
  setRoleToChange,
  onSave,
}: ChangeRoleDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change User Role</DialogTitle>
        </DialogHeader>
        {selectedUser && (
          <div>
            <p>Change role for {selectedUser.name}:</p>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  {roleToChange || "Select Role"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem
                  onClick={() => setRoleToChange("USER")}
                  disabled={roleToChange === "USER"}
                >
                  User
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setRoleToChange("ADMIN")}
                  disabled={roleToChange === "ADMIN"}
                >
                  Admin
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setRoleToChange("SUPERADMIN")}
                  disabled={roleToChange === "SUPERADMIN"}
                >
                  Superadmin
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button onClick={onSave}>Save</Button>
            <Button onClick={() => onOpenChange(false)}>Cancel</Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

interface DeleteUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedUser: User | null;
  onDelete: () => void;
}

function DeleteUserDialog({
  open,
  onOpenChange,
  selectedUser,
  onDelete,
}: DeleteUserDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Deletion ?</DialogTitle>
        </DialogHeader>
        {selectedUser && (
          <div>
            <p>Are you sure you want to delete {selectedUser.name}?</p>
            <Button onClick={onDelete}>Delete</Button>
            <Button onClick={() => onOpenChange(false)}>Cancel</Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
