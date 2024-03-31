"use client";
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React from 'react'
import { MdSearch } from 'react-icons/md';
import { useDebouncedCallback } from 'use-debounce';

const Search = ({placeholder}) => {

  const searchParams = useSearchParams();
  const {replace} = useRouter();
  const pathName = usePathname();

  

  const handleSearch = useDebouncedCallback((e)=>{

    // creating new search params
    const params = new URLSearchParams(searchParams);
    
    params.set("page",1);

    if(e.target.value){
      e.target.value.length > 2 && params.set("query", e.target.value);
    }else{
      params.delete("query");
    }

    replace(`${pathName}?${params}`);
  },300);

  return (
    <div className='flex items-center gap-2 bg-[#2e374a] p-3 rounded-xl w-max'>
        <MdSearch/>
        <input type='text' placeholder={placeholder} onChange={handleSearch} className='bg-transparent border-none text-white focus:outline-none'/>
    </div>
  )
}

export default Search