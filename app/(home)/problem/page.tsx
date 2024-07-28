import { DataTable } from "@/components/home/problemPage";
import { columns, problemArray } from "@/components/home/problemPage/column";
import { Calendar } from "@/components/ui/calendar";

const page = () => {
  return (
    <main className="flex flex-col h-fit ">
      <div className=" flex w-full h-full py-8 px-4 gap-x-8  border-t">
        <div className="flex flex-grow shadow-sm bg-white rounded-lg p-4 justify-center">
          <div className="w-full">
            <DataTable columns={columns} data={problemArray} />
          </div>
        </div>
        <div className="w-fit max-md:hidden">
          <Calendar mode="single" className="rounded-lg shadow-sm bg-white " />
        </div>
      </div>
    </main>
  );
};
export default page;
