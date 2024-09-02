import { DataTable } from "@/components/home/problemPage";
import { columns } from "@/components/home/problemPage/column";

const page = () => {
  return (
    <main className="flex flex-col w-full h-fit p-8 max-md:p-4 max-sm:p-1 ">
      <DataTable columns={columns} />
    </main>
  );
};
export default page;
