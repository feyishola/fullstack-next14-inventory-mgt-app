"use client";
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React from 'react'

const Pagination = ({count}) => {
  const searchParams = useSearchParams();
  const {replace} = useRouter();
  const pathName = usePathname();

  const page = searchParams.get("page") || 1;

  
   // creating new search params
  const params = new URLSearchParams(searchParams);
  
  const itemPerPage = 2;

  const hasPrev = itemPerPage * (parseInt(page) - 1) > 0;
  const hasNext = itemPerPage * (parseInt(page) - 1) + itemPerPage < count; //replace 6 with total number of items
  
  const handleChangePage = (type)=>{
    type === "prev" ? params.set("page", parseInt(page) - 1) : params.set("page", parseInt(page) + 1);
    replace(`${pathName}?${params}`)
  }

  return (
    <div className='container p-2 flex justify-between'>
        <button  className='py-1 px-2 cursor-pointer disabled:cursor-not-allowed bg-slate-400 rounded-md' disabled={!hasPrev} onClick={()=>handleChangePage("prev")}>Previous</button>
        <button className='py-1 px-2 cursor-pointer disabled:cursor-not-allowed bg-white text-black rounded-md' disabled={!hasNext} onClick={()=>handleChangePage("next")}>Next</button>
    </div>
  )
}

export default Pagination