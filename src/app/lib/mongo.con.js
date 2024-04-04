import mongoose from "mongoose";

export const connectionToDB = async () => {
  try {
    const dbConn = mongoose.connection;

    await mongoose.connect(process.env.MONGODB_URI);
    // if (dbConn.isConnected) return;
    // const db = await mongoose.connect(process.env.MONGODB_URI);
    // dbConn.isConnected = db.connections[0].readyState;
  } catch (error) {
    // console.log(error.message, ">>>>>");
    throw new Error("Unable to create connetion to Database" + error.message);
  }
};
