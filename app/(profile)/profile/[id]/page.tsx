import { UpdateProblem } from "@/components/dashboard/updateproblem";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";

const Page = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Open Update Problem</Button>
      </DialogTrigger>
      <DialogContent className="overflow-y-scroll h-full w-full ">
        <DialogHeader></DialogHeader>
        <UpdateProblem />
      </DialogContent>
    </Dialog>
  );
};

export default Page;
