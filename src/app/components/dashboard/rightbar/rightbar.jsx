import Image from "next/image";
import { MdPlayCircleFilled, MdReadMore } from "react-icons/md";

const Rightbar = () => {
  return (
    <div className="fixed">
      <div className="relative bg-gradient-to-t from-[#182237] to-[#253352] py-5 rounded-lg mb-5 px-3">
        <div className="absolute bottom-0 right-0 w-[50%] h-[50%]">
          <Image className="object-contain opacity-20 " src="/astronaut.png" alt="" fill />
        </div>
        <div className="flex flex-col gap-[24px]">
          <span className="font-bold">🔥 Available Now</span>
          <h3 className="font-medium text-xs text-[#b7bac1]">
            How to use the new version of the admin dashboard?
          </h3>
          <span className={""}>Takes 4 minutes to learn</span>
          <p className={""}>
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
            Reprehenderit eius libero perspiciatis recusandae possimus.
          </p>
          <button className="p-2 flex items-center gap-[10px] bg-[#5d57c9] text-white border-none rounded-md cursor-pointer w-max">
            <MdPlayCircleFilled />
            Watch
          </button>
        </div>
      </div>
      <div className="relative bg-gradient-to-t from-[#182237] to-[#253352] py-5 rounded-lg mb-5 px-3">
        <div className="flex flex-col gap-[24px]">
          <span className="font-bold">🚀 Coming Soon</span>
          <h3 className="font-medium text-xs text-[#b7bac1]">
            New server actions are available, partial pre-rendering is coming
            up!
          </h3>
          <span className="">Boost your productivity</span>
          <p className="">
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
            Reprehenderit eius libero perspiciatis recusandae possimus.
          </p>
          <button className="p-2 flex items-center gap-[10px] bg-[#5d57c9] text-white border-none rounded-md cursor-pointer w-max">
            <MdReadMore />
            Learn
          </button>
        </div>
      </div>
    </div>
  );
};

export default Rightbar;
