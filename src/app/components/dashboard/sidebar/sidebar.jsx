import React from 'react';
import {
  MdDashboard,
  MdSupervisedUserCircle,
  MdShoppingBag,
  MdAttachMoney,
  MdWork,
  MdAnalytics,
  MdPeople,
  MdOutlineSettings,
  MdHelpCenter,
  MdLogout,
} from "react-icons/md";
import MenuLink from './menulink/menulink';
import Image from 'next/image';

const Sidebar = () => {

  const menuItems = [
    {
      title: "Pages",
      list: [
        {
          title: "Dashboard",
          path: "/dashboard",
          icon: <MdDashboard />,
        },
        {
          title: "Users",
          path: "/dashboard/users",
          icon: <MdSupervisedUserCircle />,
        },
        {
          title: "Products",
          path: "/dashboard/products",
          icon: <MdShoppingBag />,
        },
        {
          title: "Transactions",
          path: "/dashboard/sales",
          icon: <MdAttachMoney />,
        },
      ],
    },
    {
      title: "Analytics",
      list: [
        {
          title: "Revenue",
          path: "/dashboard/revenue",
          icon: <MdWork />,
        },
        {
          title: "Reports",
          path: "/dashboard/reports",
          icon: <MdAnalytics />,
        },
        {
          title: "Teams",
          path: "/dashboard/teams",
          icon: <MdPeople />,
        },
      ],
    },
    {
      title: "User",
      list: [
        {
          title: "Settings",
          path: "/dashboard/settings",
          icon: <MdOutlineSettings />,
        },
        {
          title: "Help",
          path: "/dashboard/help",
          icon: <MdHelpCenter />,
        },
      ],
    },
  ];
  
  return (
    <div className='sticky top-10'>
      <div className='flex items-center gap-5 mb-5 '>
        <Image src={"/noavatar.png"} width={50} height={50} alt='user' className='rounded-full object-cover'/>
        <div className='flex flex-col'>
          <span className='font-medium'>John Doe</span>
          <span className='text-[12px] text-[#b7bac1]'>Administrator</span>
        </div>
      </div>
      <ul className='list-none'>
        {menuItems.map((cat)=>(
          <li key={cat.title}>
            <span className='font-medium text-[13px]  my-3'>{cat.title}</span>
            {cat.list.map(item=>(
              <MenuLink key={item.title} item={item}/>
            ))}
          </li>
        ))}
      </ul>
      <button className='flex  cursor-pointer items-center gap-5 p-5 my-[5px] rounded-xl bg-none border-none w-full text-white hover:bg-[#2e374a]'>
        <MdLogout size={20}/>
        Logout</button>
    </div>
  )
}

export default Sidebar