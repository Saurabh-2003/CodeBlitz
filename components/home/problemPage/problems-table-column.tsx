import { ColumnDef } from "@tanstack/react-table";

export type ProblemProps = {

  status: "ACCEPTED" | "NOT ATTEMPTED" | "ATTEMPTED";
  id: string;
  title: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
};

export const columns: ColumnDef<ProblemProps, any>[] = [
  {
    header: "Title",
    accessorKey: "title", 
  },
  {
    header: "Difficulty",
    accessorKey: "difficulty", 
  },
  {
    header: "Status",
    accessorKey: "status",
  },
];
