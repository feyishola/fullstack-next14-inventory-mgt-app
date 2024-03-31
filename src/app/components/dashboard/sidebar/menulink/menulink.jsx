"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const MenuLink = ({item}) => {

  const pathname = usePathname()

  return (
    <Link href={item.path} className={`flex  cursor-pointer items-center gap-5 p-5 my-[5px] rounded-xl hover:bg-[#2e374a] ${pathname === item.path && "bg-[#2e374a]"}`}>
      {item.icon}
      {item.title}
    </Link>
  )
}

export default MenuLink