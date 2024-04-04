import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="">
      {/* <h1>Landing Page</h1>
      <Link href={"/login"}>
        <button className="p-8 border-none bg-teal-800 rounded-[5px] text-white w-full">
          Login Page
        </button>
      </Link> */}
      <Hero />
      <CenterImage />
      <Main />
    </main>
  );
}
//bg-[#2e374a]
export const Hero = () => {
  return (
    <div className="hero bg-opacity-50 bg-gray-800 container mx-auto flex flex-col">
      <div className="nav flex flex-row justify-around p-5 items-center text-black">
        <div className="font-medium text-3xl text-[#718096] cursor-pointer">
          Starter
        </div>
        <div className="font-normal text-xl text-[#718096] cursor-pointer">
          <Link href={"/login"}>Sign In</Link>
        </div>
      </div>
      <div className="writeUp flex flex-col mt-10 items-center ">
        <div className="font-bold text-4xl p-5">
          The modern landing page for
        </div>
        <div className="font-bold text-4xl text-[#04a9f4] p-5">
          Inventory Management Solutions
        </div>
        <div className=" text-[#718096] p-5 text-xl">
          The easiest way to streamline your inventory management processes
          using Next technology.
        </div>
      </div>
      <div className="my-12 items-center justify-center mx-auto">
        <Link href={"/register"}>
          <button className="p-3 bg-[#04a9f4] rounded-md text-white cursor-pointer border-none">
            Get Started
          </button>
        </Link>
      </div>
    </div>
  );
};

export const Main = () => {
  return (
    <div className="container mx-auto flex flex-col mb-10">
      <div className="my-24 flex flex-col items-center justify-center">
        <h1 className="text-3xl font-normal">Your title here</h1>
        <p className="items-center justify-center text-center  p-5 text-lg text-[#a7b9de] w-[700px]">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus
          malesuada nisi tellus, non imperdiet nisi tempor at.
        </p>
      </div>
      <div className="flex flex-row items-center justify-around mt-10">
        <div className="w-[45%] flex flex-col  items-center">
          <h3 className="text-2xl font-normal">Your title here</h3>
          <p className="text-wrap w-[500px] items-center justify-center text-center  p-5 text-lg text-[#a7b9de]">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
            bibendum, nunc non posuere consectetur, justo erat semper enim, non
            hendrerit dui odio id enim.
          </p>
        </div>
        <div className="w-[45%] items-center">
          <Image src={"/feature.svg"} alt="img" width={500} height={500} />
        </div>
      </div>
      <div className="flex flex-row-reverse items-center justify-around mt-10">
        <div className="w-[45%] flex flex-col  items-center">
          <h3 className="text-2xl font-normal">Your title here</h3>
          <p className="text-wrap w-[500px] items-center justify-center text-center  p-5 text-lg text-[#a7b9de]">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
            bibendum, nunc non posuere consectetur, justo erat semper enim, non
            hendrerit dui odio id enim.
          </p>
        </div>
        <div className="w-[45%] items-center">
          <Image src={"/feature2.svg"} alt="img" width={500} height={500} />
        </div>
      </div>
      <div className="flex flex-row items-center justify-around mt-10">
        <div className="w-[45%] flex flex-col  items-center">
          <h3 className="text-2xl font-normal">Your title here</h3>
          <p className="text-wrap w-[500px] items-center justify-center text-center  p-5 text-lg text-[#a7b9de]">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
            bibendum, nunc non posuere consectetur, justo erat semper enim, non
            hendrerit dui odio id enim.
          </p>
        </div>
        <div className="w-[45%] items-center">
          <Image src={"/feature3.svg"} alt="img" width={500} height={500} />
        </div>
      </div>
      <div className="flex flex-row p-7 bg-[#e6f6fe] my-10 items-center justify-around rounded-md border-none">
        <div className="flex flex-col w-[700px] items-center justify-center text-center  p-5 text-lg">
          <p className="text-2xl font-medium text-black">
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
          </p>
          <p className="text-2xl font-medium text-[#04a9f4]">
            Start your Free Trial.
          </p>
        </div>
        <div>
          <button className="p-3 bg-[#04a9f4] rounded-md text-white cursor-pointer border-none">
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
};

export const CenterImage = () => {
  return (
    <div className="flex justify-center items-center mt-[100px]">
      <Image src={"/inventory2.gif"} alt="img" width={900} height={800} />
    </div>
  );
};
