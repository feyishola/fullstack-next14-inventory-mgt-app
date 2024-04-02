import { productModel, userModel } from "./models";
import { connectionToDB } from "./mongo.con";

(async () => {
  await connectionToDB();
})();
class ProductDAO {
  async createProducts(
    title,
    price,
    description,
    stock,
    color,
    size,
    category,
    expiryDate
  ) {
    try {
      const newProduct = new productModel({
        title,
        price,
        description,
        stock,
        color,
        size,
        category,
        expiryDate,
      });

      const result = await newProduct.save();
      return result;
    } catch (error) {
      console.log(error.message);
      throw new Error("Unable to create products");
    }
  }

  async getProduct(id) {
    try {
      const result = await productModel.findById(id);
      return result;
    } catch (error) {
      console.log(error.message);
      throw new Error("Unable to get single product");
    }
  }

  async getProducts(query, page) {
    const regex = new RegExp(query, "i");
    const itemPerPage = 2;

    try {
      const count = await productModel
        .find({ title: { $regex: regex } })
        .count();
      const result = await productModel
        .find({ title: { $regex: regex } })
        .limit(itemPerPage)
        .skip(itemPerPage * (page - 1));
      return { count, result };
    } catch (error) {
      console.log(error.message);
      throw new Error("Unable to get products");
    }
  }

  async updateProduct(
    id,
    title,
    price,
    description,
    stock,
    color,
    size,
    category
  ) {
    try {
      const result = await productModel.findByIdAndUpdate(
        { _id: id },
        {
          $set: {
            title,
            price,
            description,
            stock,
            color,
            size,
            category,
          },
        }
      );
      return result;
    } catch (error) {
      console.log(error.message);
      throw new Error("Unable to update products");
    }
  }

  async deleteProduct(id) {
    try {
      const result = await productModel.findByIdAndDelete(id);
      return result;
    } catch (error) {
      console.log(error.message);
      throw new Error("Unable to delete products");
    }
  }
}

class UserDAO {
  async createUser(
    firstname,
    lastname,
    address,
    userimage,
    email,
    phonenumber,
    password,
    usertype
  ) {
    try {
      const newUser = new userModel({
        firstname,
        lastname,
        address,
        userimage,
        email,
        phonenumber,
        password,
        usertype,
      });

      const response = await newUser.save();
      return response;
    } catch (error) {
      console.log(error.message);
      throw new Error("Unable to create user");
    }
  }

  async getUser(id) {
    try {
      const result = await userModel.findById(id);
      return result;
    } catch (error) {
      console.log(error.message);
      throw new Error("Unable to get single user");
    }
  }

  async getUserByEmail(email) {
    try {
      const result = await userModel.findOne({ email });
      return result;
    } catch (error) {
      console.log(error.message);
      throw new Error("Unable to get single user");
    }
  }

  async getUsers(query, page) {
    const regex = new RegExp(query, "i");

    const itemPerPage = 2;

    try {
      // await connectionToDB();

      // to return the number of existence
      const count = await userModel
        .find({ firstname: { $regex: regex } })
        .count();

      // to return users and pages
      const result = await userModel
        .find({ firstname: { $regex: regex } })
        .limit(itemPerPage)
        .skip(itemPerPage * (page - 1));

      return { count, result };
    } catch (error) {
      console.log(error.message);
      throw new Error("Unable to get users");
    }
  }

  async updateUser(id, dataObj) {
    try {
      const result = await userModel.findByIdAndUpdate({ _id: id }, dataObj, {
        new: true,
      });
      return result;
    } catch (error) {
      console.log(error.message);
      throw new Error("Unable to update user");
    }
  }

  async deleteUser(id) {
    try {
      const result = await userModel.findByIdAndDelete(id);
      return result;
    } catch (error) {
      console.log(error.message);
      throw new Error("Unable to delete user");
    }
  }
}

export const UserController = new UserDAO();

export const ProductController = new ProductDAO();
