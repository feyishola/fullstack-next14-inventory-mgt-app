"use client";
import React from "react";
import { authenticate } from "../lib/actions";
import { useFormState, useFormStatus } from "react-dom";

const LoginPage = () => {
  const [errorMessage, dispatch] = useFormState(authenticate, undefined);

  return (
    <div className="con w-full h-screen flex items-center justify-center">
      <form
        action={dispatch}
        className="form bg-[#182237] p-[50px] rounded-[10px] w-[500px] h-[500px] flex flex-col justify-center gap-8 items-center"
      >
        <h1>Login</h1>
        <input
          type="text"
          placeholder="Email"
          name="email"
          className="p-8 border-2 border-[#2e374a] rounded-[5px] bg-[#151c2c] text-white w-full"
        />
        <input
          type="password"
          placeholder="Password"
          name="password"
          className="p-8 border-2 border-[#2e374a] rounded-[5px] bg-[#151c2c] text-white w-full"
        />
        <div>{errorMessage && <p>{errorMessage}</p>}</div>
        {/* <button
          className="p-8 border-none bg-teal-800 rounded-[5px] text-white w-full"
          aria-disabled={pending}
          type="submit"
        >
          Login
        </button> */}
        <LoginButton />
      </form>
    </div>
  );
};

export default LoginPage;

function LoginButton() {
  const { pending } = useFormStatus();

  const handleClick = (event) => {
    if (pending) {
      event.preventDefault();
    }
    // event.preventDefault();
  };

  return (
    <button
      aria-disabled={pending}
      type="submit"
      onClick={handleClick}
      className="p-8 border-none bg-teal-800 rounded-[5px] text-white w-full"
    >
      Login
    </button>
  );
}
