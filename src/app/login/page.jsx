import React from 'react'

const LoginPage = () => {
  return (
    <div className='con w-full h-screen flex items-center justify-center'>
      <form action='' className='form bg-[#182237] p-[50px] rounded-[10px] w-[500px] h-[500px] flex flex-col justify-center gap-8 items-center'>
        <h1>Login</h1>
        <input type='text' placeholder='Email' className='p-8 border-2 border-[#2e374a] rounded-[5px] bg-[#151c2c] text-white w-full'/>
        <input type='password' placeholder='Password'className='p-8 border-2 border-[#2e374a] rounded-[5px] bg-[#151c2c] text-white w-full'/>
        <button className='p-8 border-none bg-teal-800 rounded-[5px] text-white w-full'>Login</button>
      </form>
    </div>
  )
}

export default LoginPage