"use server";
import { revalidatePath } from "next/cache";
import { ProductController, UserController } from "./controllers";
import { connectionToDB } from "./mongo.con";
import { redirect } from "next/navigation";
import { signIn } from "../auth";

// creating a connection to db
(async () => {
  await connectionToDB();
})();

export async function authenticate(_currentState, formData) {
  try {
    // console.log({ _currentState, formData });
    const email = formData.get("email");
    const password = formData.get("password");
    console.log({ _currentState, email, password });
    await signIn("credentials", {
      email,
      password,
      redirect: true,
    });
    console.log("login Succesfully");
  } catch (error) {
    if (error.type === "CredentialsSignin") {
      return "Invalid credentials.";
    }
    throw error;
  }
}

// handling forms data
export const addUser = async (formData) => {
  "use server"; // u can do dis here or at the top for all
  const {
    firstname,
    lastname,
    email,
    phonenumber,
    password,
    usertype,
    userimage,
    address,
  } = Object.fromEntries(formData);

  try {
    const newUser = await UserController.createUser(
      firstname,
      lastname,
      address,
      userimage,
      email,
      phonenumber,
      password,
      usertype
    );
  } catch (error) {
    console.log(error);
    throw new Error("error creating a new user");
  }
  revalidatePath("/dashboard/users"); // dis would refresh the the data as soon as u fetch.. in react we were using "swr" or "useQuery" to achieve this.
  redirect("/dashboard/users"); // this is to direct the page to anywhere of ur choice. we were using "useNavigate" in react
};

export const updateUser = async (formData) => {
  const {
    id,
    firstname,
    lastname,
    address,
    userimage,
    email,
    phonenumber,
    password,
  } = Object.fromEntries(formData);

  try {
    const updateFields = {
      firstname,
      lastname,
      address,
      userimage,
      email,
      phonenumber,
      password,
    };

    // Remove empty or undefined fields
    Object.keys(updateFields).forEach((key) => {
      if (updateFields[key] === "" || updateFields[key] === undefined) {
        delete updateFields[key];
      }
    });
    await UserController.updateUser(id, updateFields);
  } catch (error) {
    console.log(error);
    throw new Error("error updating a new user");
  }
  revalidatePath("/dashboard/users"); // dis would refresh the the data as soon as u fetch.. in react we were using "swr" or "useQuery" to achieve this.
  redirect("/dashboard/users"); // this is to direct the page to anywhere of ur choice. we were using "useNavigate" in react
};

export const deleteUser = async (formData) => {
  const { id } = Object.fromEntries(formData);

  try {
    const newUser = await UserController.deleteUser(id);
  } catch (error) {
    console.log(error);
    throw new Error("error deleting user");
  }
  revalidatePath("/dashboard/users"); // dis would refresh the the data as soon as u fetch.. in react we were using "swr" or "useQuery" to achieve this.
};

///****************************************************************Products server action  *********************** */

export const createProduct = async (formData) => {
  const { title, category, price, stock, color, size, expiryDate, desc } =
    Object.fromEntries(formData);
  try {
    const newProduct = await ProductController.createProducts(
      title,
      price,
      desc,
      stock,
      color,
      size,
      category,
      expiryDate
    );
  } catch (error) {
    console.log(error);
    throw new Error("error deleting user");
  }
  revalidatePath("/dashboard/products");
  redirect("/dashboard/products");
};

export const updateProduct = async (formData) => {
  const { id, title, price, stock, color, size, desc } =
    Object.fromEntries(formData);
  try {
    const updateFields = {
      title,
      price,
      stock,
      color,
      size,
      desc,
    };

    // Remove empty or undefined fields
    Object.keys(updateFields).forEach((key) => {
      if (updateFields[key] === "" || updateFields[key] === undefined) {
        delete updateFields[key];
      }
    });
    await ProductController.updateProduct(id, updateFields);
  } catch (error) {
    console.log(error);
    throw new Error("error updating a new product");
  }
  revalidatePath("/dashboard/products");
  redirect("/dashboard/products");
};

export const deleteProduct = async (formData) => {
  const id = formData.get("id");
  try {
    const result = ProductController.deleteProduct(id);
  } catch (error) {
    console.log(error);
    throw new Error("error deleting product");
  }
  revalidatePath("/dashboard/products");
};
