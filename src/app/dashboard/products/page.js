import Pagination from "@/app/components/dashboard/pagination/pagination";
import Search from "@/app/components/dashboard/search/search";
import { ProductController } from "@/app/lib/controllers";
import { formatter } from "@/app/utils/helpers";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const ProductPage = async ({ searchParams }) => {
  const query = searchParams?.query || "";
  const page = searchParams?.page || 1;
  const { count, result } = await ProductController.getProducts(query, page);
  return (
    <div className="p-5 rounded-lg mt-5 bg-[#182237]">
      <div className="flex items-center justify-between">
        <Search placeholder={"Search for a product..."} />
        <Link href={"/dashboard/products/add"}>
          <button className="p-[10px] bg-[#5d57c9] text-white border-none rounded-md cursor-pointer">
            Add new
          </button>
        </Link>
      </div>
      <table className="table w-full">
        <thead>
          <tr>
            <td className="p-[10px]">Prod. Name</td>
            <td className="p-[10px]">Description</td>
            <td className="p-[10px]">Price At</td>
            <td className="p-[10px]">Created At</td>
            <td className="p-[10px]">Stock</td>
            <td className="p-[10px]">Action</td>
          </tr>
        </thead>
        <tbody>
          {/* {result.map(product=>())} */}
          <tr>
            <td className="p-[10px]">
              <div className="user flex items-center gap-[10px]">
                <Image
                  src={"/noproduct.jpg"}
                  alt="user"
                  width={40}
                  height={40}
                  className="userImg rounded-full object-cover"
                />
                IPhone
              </div>
            </td>
            <td className="p-[10px]">Blah blah blah</td>
            <td className="p-[10px]">{formatter.format(1000)}</td>
            <td className="p-[10px]">13-01-2022</td>
            <td className="p-[10px]">72</td>
            <td className="p-[10px]">
              <div className="flex gap-[10px]">
                <Link href={"/dashboard/products/id"}>
                  <button
                    className={`${"py-1 px-2 rounded text-white border-none cursor-pointer"} ${"bg-teal-800"}`}
                  >
                    View
                  </button>
                </Link>
                <button
                  className={`${"py-1 px-2 rounded text-white border-none cursor-pointer"} ${"bg-[#DC143C]"}`}
                >
                  Delete
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <Pagination count={count} />
    </div>
  );
};

export default ProductPage;
