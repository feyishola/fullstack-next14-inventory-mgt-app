"use server";
import { revalidatePath } from "next/cache";
import { UserController } from "./controllers";
import { connectionToDB } from "./mongo.con";
import { redirect } from "next/navigation";
import { signIn } from "../auth";

// creating a connection to db
(async () => {
  await connectionToDB();
})();

export async function authenticate(_prevState, formData) {
  try {
    console.log({ _prevState, formData });
    const email = formData.get("email");
    const password = formData.get("password");
    console.log({ email, password });
    await signIn("credentials", {
      email,
      password,
    });
  } catch (error) {
    if (error) {
      switch (error.type) {
        case "CredentialsSignin":
          return "Invalid credentials.";
        default:
          return "Something went wrong.";
      }
    }
    throw error;
  }
  //   const { email, password } = Object.fromEntries(formData);
  //   console.log(email, password);
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
    console.log(updateFields);
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
