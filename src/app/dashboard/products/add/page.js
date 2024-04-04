import { createProduct } from "@/app/lib/actions";
import React from "react";

const AddProductPage = () => {
  return (
    <div className="cont bg-[#182237] p-5 rounded-lg mt-5">
      <form
        action={createProduct}
        className="form flex flex-wrap justify-between"
      >
        <input
          type="text"
          placeholder="title"
          name="title"
          required
          className="p-7 w-[45%] bg-[#151c2c] text-white rounded-md mb-8 border-2 border-[#2e374a]"
        />
        <select
          name="category"
          id="category"
          className="p-7 w-[45%] bg-[#151c2c] text-white rounded-md mb-8 border-2 border-[#2e374a]"
        >
          <option value={"general"}>Choose a category</option>
          <option value={"Electronics"}>Electronics</option>
          <option value={"Kitchen"}>Kitchen</option>
          <option value={"Toys"}>Toys</option>
          <option value={"Clothings"}> Clothings</option>
          <option value={"Beverages"}>Beverages</option>
          <option value={"Computers"}>Computers</option>
          <option value={"Phones"}>Phones</option>
        </select>
        <input
          type="number"
          placeholder="price"
          name="price"
          className="p-7 w-[45%] bg-[#151c2c] text-white rounded-md mb-8 border-2 border-[#2e374a]"
        />
        <input
          type="number"
          placeholder="stock"
          name="stock"
          className="p-7 w-[45%] bg-[#151c2c] text-white rounded-md mb-8 border-2 border-[#2e374a]"
        />
        <input
          type="text"
          placeholder="color"
          name="color"
          className="p-7 w-[45%] bg-[#151c2c] text-white rounded-md mb-8 border-2 border-[#2e374a]"
        />
        <input
          type="text"
          placeholder="size"
          name="size"
          className="p-7 w-[45%] bg-[#151c2c] text-white rounded-md mb-8 border-2 border-[#2e374a]"
        />
        <input
          type="text"
          placeholder="expiry Date"
          name="expiryDate"
          className="p-7 w-[45%] bg-[#151c2c] text-white rounded-md mb-8 border-2 border-[#2e374a]"
        />
        <textarea
          name="desc"
          id="desc"
          rows={16}
          placeholder="Description"
          className="p-7 bg-[#151c2c] text-white rounded-md mb-8 border-2 border-[#2e374a] w-full"
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

export default AddProductPage;
