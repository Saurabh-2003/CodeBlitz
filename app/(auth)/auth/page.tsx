
import { Login } from "@/components/login-signup";
import GetServerSession from "@/core/hooks/getServerSession";
import { redirect } from "next/navigation";
const Page = async() => {

const session = await GetServerSession();
if (session) {
  redirect("/profile");
}
  return <div><Login /></div>
};
export default Page;
