"use client";
import TopBar from "@/components/code-editor/top-bar";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FaCode, FaTerminal } from "react-icons/fa";
import { BsFillFileTextFill } from "react-icons/bs";
import { GoBook } from "react-icons/go";
import { AiFillExperiment } from "react-icons/ai";
import { FaHistory } from "react-icons/fa";
import { Editor } from "@/components/code-editor/editor";
import { LuMaximize } from "react-icons/lu";
import { IoCodeSlashOutline } from "react-icons/io5";
import { GrPowerReset } from "react-icons/gr";
import { Maximize2 } from "lucide-react";
import { LanguageDropDown } from "@/components/code-editor/language-dropdown";
import { IoIosCheckboxOutline } from "react-icons/io";
import { Input } from "@/components/ui/input";

const Page = () => {
  return (
    <main className=" flex flex-col h-dvh max-h-dvh ">
      <TopBar />
      <div className="w-full   h-full">
        <ResizablePanelGroup
          direction="horizontal"
          className="w-full rounded-lg gap-1 py-2"
        >
          <ResizablePanel
            defaultSize={40}
            className=" bg-white p-2 w-full  rounded-lg "
          >
            <Tabs
              defaultValue="description"
              className="w-full h-full overflow-x-auto overflow-y-auto "
            >
              <TabsList className="bg-transparent">
                <TabsTrigger value="description" className="gap-1">
                  <BsFillFileTextFill
                    className="text-blue-400 group-focus:text-red-500"
                    size={18}
                  />
                  Description
                </TabsTrigger>
                <TabsTrigger value="editorial" className="gap-1">
                  <GoBook size={18} className=" text-amber-400" />
                  Editorial
                </TabsTrigger>
                <TabsTrigger value="solutions" className="gap-1">
                  <AiFillExperiment size={18} className=" text-blue-400" />
                  Solutions
                </TabsTrigger>
                <TabsTrigger value="submissions" className="gap-1">
                  <FaHistory size={16} className=" text-blue-400" />
                  Submissions
                </TabsTrigger>
              </TabsList>
              <TabsContent className=" w-full " value="description">
                Make changes to your account here.
              </TabsContent>
              <TabsContent value="editorial">
                Change your password here.
              </TabsContent>
              <TabsContent value="solutions">
                Make changes to your account here.
              </TabsContent>
              <TabsContent value="submissions">
                Change your password here.
              </TabsContent>
            </Tabs>
          </ResizablePanel>
          <ResizableHandle className=" bg-transparent hover:bg-slate-500 my-4" />
          <ResizablePanel defaultSize={60}>
            <ResizablePanelGroup direction="vertical" className="gap-1">
              <ResizablePanel
                defaultSize={65}
                className=" bg-white p-2  rounded-lg w-full h-full overflow-x-auto"
              >
                <div className="h-full  flex flex-col ">
                  <div className="flex  text-zinc-600 justify-between items-center p-2 bg-zinc-100/50 sticky top-0">
                    <div className="flex items-center gap-2">
                      <IoCodeSlashOutline
                        size={20}
                        className="text-green-500"
                      />
                      Code
                    </div>
                    <LuMaximize size={20} />
                  </div>
                  <div className="flex py-2 text-zinc-600 justify-between items-center  top-0">
                    <LanguageDropDown />
                    <div className="flex items-center gap-2">
                      <GrPowerReset size={16} />
                      <Maximize2 size={15} />
                    </div>
                  </div>
                  <div className="overflow-y-auto">
                    <Editor />
                  </div>
                </div>
              </ResizablePanel>
              <ResizableHandle className=" bg-transparent hover:bg-slate-500 mx-4" />
              <ResizablePanel
                defaultSize={35}
                className=" bg-white flex flex-col p-2  rounded-lg w-full h-full overflow-x-auto"
              >
                <div className="flex w-full overflow-x-auto overflow-y-auto h-full items-center justify-center ">
                  <Tabs
                    defaultValue="testcase"
                    className="w-full h-full overflow-x-auto text-sm overflow-y-auto "
                  >
                    <TabsList className=" ">
                      <TabsTrigger value="testcase" className="gap-1">
                        <IoIosCheckboxOutline
                          className="text-green-400 "
                          size={18}
                        />
                        Test case
                      </TabsTrigger>
                      <TabsTrigger value="testresult" className="gap-1">
                        <FaTerminal size={18} className=" text-green-400" />
                        Test Result
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="testcase" className="text-zinc-500">
                      nums ={" "}
                      <Input className=" border bg-gray-100 focus-visible:ring-0 outline-none focus:border-blue-400" />
                      ans =
                      <Input className=" border bg-gray-100 ring-0 focus-visible:ring-0 focus:border-blue-400" />
                    </TabsContent>
                    <TabsContent value="testresult" className="text-zinc-500 ">
                      n ={" "}
                      <Input className=" border mb-2 bg-gray-100 focus-visible:ring-0 outline-none focus:border-blue-400" />
                      nums =
                      <Input className=" border mb-2 ring-0  bg-gray-100 focus-visible:ring-0 focus:border-blue-400" />
                      output ={" "}
                      <Input className=" border mb-2 bg-gray-100 focus-visible:ring-0 outline-none focus:border-blue-400" />
                      expected =
                      <Input className=" border mb-2 bg-gray-100 ring-0 focus-visible:ring-0 focus:border-blue-400" />
                    </TabsContent>
                  </Tabs>
                </div>
                <div className="flex items-center gap-2  text-sm text-zinc-500">
                  <IoCodeSlashOutline size={18} />
                  Source
                </div>
              </ResizablePanel>
            </ResizablePanelGroup>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </main>
  );
};

export default Page;
