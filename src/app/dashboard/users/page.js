import Pagination from "@/app/components/dashboard/pagination/pagination";
import Search from "@/app/components/dashboard/search/search";
import { deleteUser } from "@/app/lib/actions";
import { UserController } from "@/app/lib/controllers";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const Userspage = async ({ searchParams }) => {
  const query = searchParams?.query || "";
  const page = searchParams?.page || 1;

  const { count, result } = await UserController.getUsers(query, page);

  return (
    <div className="p-5 rounded-lg mt-5 bg-[#182237]">
      <div className="flex items-center justify-between">
        <Search placeholder={"Search for a user..."} />
        <Link href={"/dashboard/users/add"}>
          <button className="p-[10px] bg-[#5d57c9] text-white border-none rounded-md cursor-pointer">
            Add new
          </button>
        </Link>
      </div>
      <table className="table w-full">
        <thead>
          <tr>
            <td className="p-[10px]">Name</td>
            <td className="p-[10px]">Email</td>
            <td className="p-[10px]">Created At</td>
            <td className="p-[10px]">Role</td>
            <td className="p-[10px]">Status</td>
            <td className="p-[10px]">Action</td>
          </tr>
        </thead>
        <tbody>
          {result.map((user) => (
            <tr key={user.id}>
              <td className="p-[10px]">
                <div className="user flex items-center gap-[10px]">
                  <Image
                    src={user?.userimage || "/noavatar.png"}
                    alt="user"
                    width={40}
                    height={40}
                    className="userImg rounded-full object-cover"
                  />
                  {user?.id ? user.firstname : "No one"}
                </div>
              </td>
              <td className="p-[10px]">{user?.email}</td>
              <td className="p-[10px]">
                {user?.createdAt.toString().slice(4, 16)}
              </td>
              <td className="p-[10px]">{user?.usertype}</td>
              <td className="p-[10px]">Active</td>
              <td className="p-[10px]">
                <div className="flex gap-[10px]">
                  <Link href={`/dashboard/users/${user.id}`}>
                    <button
                      className={`${"py-1 px-2 rounded text-white border-none cursor-pointer"} ${"bg-teal-800"}`}
                    >
                      View
                    </button>
                  </Link>
                  <form action={deleteUser}>
                    <input type="hidden" name="id" value={user.id} />
                    <button
                      className={`${"py-1 px-2 rounded text-white border-none cursor-pointer"} ${"bg-[#DC143C]"}`}
                    >
                      Delete
                    </button>
                  </form>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Pagination count={count} />
    </div>
  );
};

export default Userspage;
