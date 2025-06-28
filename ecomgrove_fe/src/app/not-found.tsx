import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container flex flex-col justify-center items-center mx-auto h-screen selection:bg-mid-night selection:text-white p-10 md:p-0">
      <div className="relative w-[500px] h-[350px]">
        <Image
          src="https://shofy-svelte.vercel.app/img/error/error.png"
          alt="Error"
          fill
          priority
          sizes="medium"
          className="object-contain"
        />
      </div>

      <h1 className="text-gray-700 text-4xl font-semibold mt-6">
        404 Not Found
      </h1>
      <span className="text-gray-700 text-xl text-center max-w-xl">
        Whoops, this is embarrassing. Looks like the page you were looking for
        wasn't found.
      </span>
      <Link href="/" className="mt-4">
        <Button variant={"black"} className="p-6">
          Back to Home
        </Button>
      </Link>
    </div>
  );
}
