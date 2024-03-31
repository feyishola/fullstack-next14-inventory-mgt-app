import { updateUser } from "@/app/lib/actions";
import { UserController } from "@/app/lib/controllers";
import Image from "next/image";
import React from "react";

const SingleUserPage = async ({ params }) => {
  const { id } = params;
  const user = await UserController.getUser(id);
  return (
    <div className="cont flex gap-12 mt-5">
      <div className="infocont w-[30%] bg-[#182237] p-5 rounded-lg font-bold text-white h-max">
        <div className="imgcont w-full h-[300px] relative rounded-xl overflow-hidden mb-5">
          <Image src={"/noavatar.png"} alt="userImage" fill />
        </div>
        {user?.lastname}
      </div>
      <div className="formcont w-[70%] bg-[#182237] p-5 rounded-lg">
        <form action={updateUser} className="form flex flex-col">
          <input type="hidden" name="id" value={user?.id} />
          <label className="text-xs">Firstname</label>
          <input
            type="text"
            name="firstname"
            placeholder={user?.firstname}
            className="p-5 border-2 border-[#2e374a] rounded bg-[#151c2c] text-white my-[10px]"
          />
          <label className="text-xs">LastName</label>
          <input
            type="text"
            name="lastname"
            placeholder={user?.lastname}
            className="p-5 border-2 border-[#2e374a] rounded bg-[#151c2c] text-white my-[10px]"
          />
          <label className="text-xs">Email</label>
          <input
            type="email"
            name="email"
            placeholder={user?.email}
            className="p-5 border-2 border-[#2e374a] rounded bg-[#151c2c] text-white my-[10px]"
          />
          <label className="text-xs">PhoneNumber</label>
          <input
            type="text"
            name="phoneNumber"
            placeholder={user?.phonenumber}
            className="p-5 border-2 border-[#2e374a] rounded bg-[#151c2c] text-white my-[10px]"
          />
          <label className="text-xs">Password</label>
          <input
            type="Password"
            name="password"
            placeholder="password"
            className="p-5 border-2 border-[#2e374a] rounded bg-[#151c2c] text-white my-[10px]"
          />
          <label className="text-xs">UserImage</label>
          <input
            type="text"
            name="userimage"
            placeholder={user?.userimage}
            className="p-5 border-2 border-[#2e374a] rounded bg-[#151c2c] text-white my-[10px]"
          />
          <button className="w-full p-5 bg-teal-800 text-white border-none rounded-md cursor-pointer mt-5">
            Update
          </button>
        </form>
      </div>
    </div>
  );
};

export default SingleUserPage;
