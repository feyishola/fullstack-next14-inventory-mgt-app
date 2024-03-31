import mongoose from "mongoose";

const { Schema, model } = mongoose;

const userSchema = new Schema(
  {
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    address: { type: String },
    userimage: { type: String, default: "something.jpeg" },
    email: { type: String, required: true, unique: true },
    phonenumber: { type: String, unique: true },
    password: { type: String, required: true },
    usertype: { type: String, enum: ["Admin", "Regular"], default: "Regular" },
  },
  { timestamps: true }
);

const productSchema = new Schema(
  {
    title: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    description: { type: String },
    stock: { type: Number, required: true, min: 0 },
    color: { type: String },
    size: { type: String },
    expiryDate: { type: String, required: true },
    category: {
      type: String,
      enum: [
        "Electronics",
        "Kitchen",
        "Toys",
        "Clothings",
        "Beverages",
        "Computers",
        "Phones",
      ],
    },
  },
  { timestamps: true }
);

export const userModel = mongoose.models.users || model("users", userSchema);
export const productModel =
  mongoose.models.products || model("products", productSchema);
