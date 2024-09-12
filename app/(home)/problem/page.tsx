import { ProblemsDataTable } from "@/components/home/problemPage/problems-data-table";
import { columns } from "@/components/home/problemPage/problems-table-column";
const page = () => {
  return (
    <main className="flex flex-col w-full h-fit p-8 max-md:p-4 max-sm:p-1 ">
      <ProblemsDataTable columns={columns} />
    </main>
  );
};
export default page;
