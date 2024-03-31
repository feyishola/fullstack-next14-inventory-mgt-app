import mongoose from "mongoose";

export const connectionToDB = async () => {
  // const dbConn = {};
  try {
    const dbConn = mongoose.connection;

    dbConn
      .on("connected", () => {
        console.log("connected to mongodb");
      })
      .on("error", () => {
        console.log("Error connecting to mongodb");
      })
      .on("disconnected", () => {
        setTimeout(async () => {
          await mongoose.connect(process.env.MONGODB_URI);
        }, 3000);
      });

    await mongoose.connect(process.env.MONGODB_URI);
    // if (dbConn.isConnected) return;
    // const db = await mongoose.connect(process.env.MONGODB_URI);
    // dbConn.isConnected = db.connections[0].readyState;
  } catch (error) {
    console.log(error.message);
    throw new Error("Unable to create connetion to Database");
  }
};
