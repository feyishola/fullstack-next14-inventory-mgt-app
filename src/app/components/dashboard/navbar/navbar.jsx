"use client";
import { usePathname } from 'next/navigation';
import {
  MdNotifications,
  MdOutlineChat,
  MdPublic,
  MdSearch,
} from "react-icons/md";
import React from 'react'

const Navbar = () => {
  const pathname = usePathname();
  return (
    <div className='flex justify-between p-5 items-center rounded-xl bg-[#182237]'>
      <div className='font-medium text-[#b7bac1] capitalize'>{pathname.split('/').pop()}</div>
      <div className='flex items-center gap-5'>
        <div className='flex items-center gap-2 bg-[#2e374a] p-3 rounded-xl'>
          <MdSearch/>
          <input type="text" placeholder='search' className='bg-transparent border-none text-white focus:outline-none'/>
        </div>
        <div className='flex gap-5'>
          <MdOutlineChat size={20}/>
          <MdNotifications size={20}/>
          <MdPublic size={20}/>
        </div>
      </div>
    </div>
  )
}

export default Navbar