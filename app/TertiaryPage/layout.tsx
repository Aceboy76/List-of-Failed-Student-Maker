import Image from "next/image";
import MainPage from "./page";

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="h-15 w-full bg-amber-300 px-10 flex items-center">
        <div className="flex gap-20">
          <Image
            src="/sti_logo.png"
            alt="sti logo"
            width={50}
            height={50}
            className="w-auto h-auto"
          />

          <div className="flex text-2xl items-center ">LIST OF FAILED STUDENTS MAKER</div>
        </div>
      </div>

      <div className="flex-1 w-full px-10 py-5">
        <MainPage />
      </div>
    </div>
  );
}
