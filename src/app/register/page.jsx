import React from "react";
import { addUser } from "../lib/actions";

const RegisterPage = () => {
  return (
    <div className="cont bg-[#182237] p-5 rounded-lg my-20 w-[40%] h-[60%] mx-auto ">
      <form action={addUser} className="form flex flex-wrap justify-between">
        <input
          type="text"
          placeholder="Firstname"
          name="firstname"
          required
          className="p-7 w-[45%] bg-[#151c2c] text-white rounded-md mb-8 border-2 border-[#2e374a]"
        />
        <input
          type="text"
          placeholder="Lastname"
          name="lastname"
          required
          className="p-7 w-[45%] bg-[#151c2c] text-white rounded-md mb-8 border-2 border-[#2e374a]"
        />
        <input
          type="email"
          placeholder="Email"
          name="email"
          required
          className="p-7 w-[45%] bg-[#151c2c] text-white rounded-md mb-8 border-2 border-[#2e374a]"
        />
        <input
          type="text"
          placeholder="Phonenumber"
          name="phonenumber"
          required
          className="p-7 w-[45%] bg-[#151c2c] text-white rounded-md mb-8 border-2 border-[#2e374a]"
        />
        <input
          type="password"
          placeholder="Password"
          name="password"
          required
          className="p-7 w-[45%] bg-[#151c2c] text-white rounded-md mb-8 border-2 border-[#2e374a]"
        />
        <select
          name="usertype"
          id="usertype"
          className="p-7 w-[45%] bg-[#151c2c] text-white rounded-md mb-8 border-2 border-[#2e374a]"
        >
          <option value={"general"}>Choose user Type</option>
          <option value={"Admin"}>Admin</option>
          <option value={"Regular"}>Regular</option>
        </select>

        <input
          type="text"
          placeholder="userimage"
          name="userimage"
          className="p-7 w-[45%] bg-[#151c2c] text-white rounded-md mb-8 border-2 border-[#2e374a]"
        />

        <textarea
          name="address"
          id="address"
          rows={5}
          placeholder="Address"
          className="p-7 text-white rounded-md mb-8 border-2 border-[#2e374a] w-full bg-[#151c2c]"
        />
        <button
          type="submit"
          className="w-full p-7 bg-teal-800 text-white border-none rounded-md cursor-pointer"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default RegisterPage;