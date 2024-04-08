import { updateProduct } from "@/app/lib/actions";
import { ProductController } from "@/app/lib/controllers";
import Image from "next/image";
import React from "react";

const SingleProductPage = async ({ params }) => {
  const { id } = params;
  const product = await ProductController.getProduct(id);
  return (
    <div className="cont flex gap-12 mt-5">
      <div className="infocont w-[30%] bg-[#182237] p-5 rounded-lg font-bold text-white h-max">
        <div className="imgcont w-full h-[300px] relative rounded-xl overflow-hidden mb-5">
          <Image src={"/noproduct.jpg"} alt="userImage" fill />
        </div>
        {product?.title}
      </div>
      <div className="formcont w-[70%] bg-[#182237] p-5 rounded-lg">
        <form action={updateProduct} className="form flex flex-col">
          <input type="hidden" name="id" value={product?.id} />
          <label className="text-xs">Product Name</label>
          <input
            type="text"
            name="title"
            placeholder={product?.title}
            className="p-5 border-2 border-[#2e374a] rounded bg-[#151c2c] text-white my-[10px]"
          />
          <label className="text-xs">Price</label>
          <input
            type="text"
            name="price"
            placeholder={product?.price}
            className="p-5 border-2 border-[#2e374a] rounded bg-[#151c2c] text-white my-[10px]"
          />
          <label className="text-xs">Color</label>
          <input
            type="text"
            name="Color"
            placeholder={product?.color}
            className="p-5 border-2 border-[#2e374a] rounded bg-[#151c2c] text-white my-[10px]"
          />
          <label className="text-xs">Stock</label>
          <input
            type="number"
            name="stock"
            placeholder={product?.stock}
            className="p-5 border-2 border-[#2e374a] rounded bg-[#151c2c] text-white my-[10px]"
          />
          <label className="text-xs">Product Category</label>
          <select
            name="category"
            id="category"
            className="p-5 border-2 border-[#2e374a] rounded bg-[#151c2c] text-white my-[10px]"
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
          <label className="text-xs">Size</label>
          <input
            type="text"
            name="size"
            placeholder={product?.size}
            className="p-5 border-2 border-[#2e374a] rounded bg-[#151c2c] text-white my-[10px]"
          />
          <label className="text-xs">Product Image</label>
          <input
            type="text"
            name="productImage"
            placeholder="Product Image"
            className="p-5 border-2 border-[#2e374a] rounded bg-[#151c2c] text-white my-[10px]"
          />
          <label className="text-xs">Description</label>
          <textarea
            name="desc"
            id="desc"
            rows={16}
            placeholder={product?.description}
            className="p-5 border-2 border-[#2e374a] rounded bg-[#151c2c] text-white my-[10px]"
          />

          <button className="w-full p-5 bg-teal-800 text-white border-none rounded-md cursor-pointer mt-5">
            Update
          </button>
        </form>
      </div>
    </div>
  );
};

export default SingleProductPage;
