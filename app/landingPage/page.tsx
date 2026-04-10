import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function LandingPage() {
  return (
    <>
      <div className="h-screen w-full bg-amber-100 p-[75px] flex flex-col gap-15 ">
        <div>
          <Image src="/sti_logo.png" alt="sti logo" width={100} height={100} className="w-auto h-auto"/>
        </div>
        <div className="">
          <div className="text-6xl font-bold">LIST OF FAIL MAKER</div>
          <div className="text-3xl text-black/50 ">
            Create an excel file of your list of failed students easily
          </div>
        </div>

        <div className="flex gap-10">
          <Link href={"/TertiaryPage"}>
            <Button
              className="text-2xl px-10 py-7 rounded-4xl bg-green-400 hover:bg-green-500"
              variant={"outline"}
            >
              MAKE FOR TERTIARY
            </Button>
          </Link>
        </div>
      </div>
    </>
  );
}
