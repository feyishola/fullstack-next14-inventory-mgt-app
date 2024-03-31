import React from "react";

const AddProductPage = () => {
  return (
    <div className="cont bg-[#182237] p-5 rounded-lg mt-5">
      <form action="" className="form flex flex-wrap justify-between">
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
          <option value={"electronics"}>Electronics</option>
          <option value={"kitchen"}>Kitchen</option>
          <option value={"toys"}>Toys</option>
          <option value={"clothings"}> Clothings</option>
          <option value={"beverages"}>Beverages</option>
          <option value={"computers"}>Computers</option>
          <option value={"phones"}>Phones</option>
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
          name="expiry Date"
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
