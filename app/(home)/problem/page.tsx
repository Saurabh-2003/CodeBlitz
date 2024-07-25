import { Calendar } from "@/components/ui/calendar";
import Header from "../header";
import { ColumnDef } from "@tanstack/react-table"
import { DataTable } from "@/components/home";
import { problemArray,columns} from "@/components/home/problemPage/column";

type ProblemProps = {
  id: string
  problemname:string
  acceptance: number
  difficulty: "medium" | "hard" | "easy"
}



const page = () => {
  return (
    <main className="flex flex-col h-dvh max-h-dvh">
      <Header/>
      <div className="bg-white flex w-full h-full pt-8 px-4 gap-x-8  mt-4">
        <div className="flex w-3/4 justify-center">
        <div className="w-full"><DataTable columns={columns} data={problemArray} />
        </div>
        </div>
        <div className="w-1/4">
          <Calendar
            mode="single"

            className="w-fit rounded-md shadow-md  "
          />
        </div>

      </div>
    </main>
  );
};
export default page;
