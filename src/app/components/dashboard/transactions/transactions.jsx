import { formatter } from '@/app/utils/helpers'
import Image from 'next/image'
import React from 'react'

const Transactions = ({sales}) => {
  return (
    <div className='cont bg-[#182237] p-5 rounded-xl'>
        <h2 className='title mb-5 font-extralight text-[#b7bac1]'></h2>
        <table className='table w-full'>
             <thead>
                <tr>
                    <td className='p-2'>Name</td>
                    <td className='p-2'>Status</td>
                    <td className='p-2'>Date</td>
                    <td className='p-2'>Time</td>
                </tr>
             </thead>
             <tbody>
                <tr>
                    <td className='p-2'>
                        <div className='flex flex-row gap-2 items-center'>

                            <Image src={'/noavatar.png'} alt='user' width={40} height={40} className='object-cover rounded-full'/>
                            John Doe
                        </div>
                    </td>
                    <td className='p-2'>
                        <span className='rounded p-2 text-sm text-white bg-[#f7cb7375]'>Pending</span>
                    </td>
                    <td className='p-2'>
                        14.02.2024
                    </td>
                    <td className='p-2'>
                        {formatter.format(300)} 
                    </td>
                </tr>
                <tr>
                    <td className='p-2'>
                        <div className='flex flex-row gap-2 items-center'>

                            <Image src={'/noavatar.png'} alt='user' width={40} height={40} className='object-cover rounded-full'/>
                            John Doe
                        </div>
                    </td>
                    <td className='p-2'>
                        <span className='rounded p-2 text-sm text-white bg-[#f7737375]'>Pending</span>
                    </td>
                    <td className='p-2'>
                        14.02.2024
                    </td>
                    <td className='p-2'>
                        {formatter.format(300)} 
                    </td>
                </tr>
                <tr>
                    <td className='p-2'>
                        <div className='flex flex-row gap-2 items-center'>

                            <Image src={'/noavatar.png'} alt='user' width={40} height={40} className='object-cover rounded-full'/>
                            John Doe
                        </div>
                    </td>
                    <td className='p-2'>
                        <span className='rounded p-2 text-sm text-white bg-[#f7cb7375]'>Pending</span>
                    </td>
                    <td className='p-2'>
                        14.02.2024
                    </td>
                    <td className='p-2'>
                        {formatter.format(300)} 
                    </td>
                </tr>
             </tbody>
        </table>
    </div>
  )
}

export default Transactions