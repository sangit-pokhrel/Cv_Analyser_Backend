const mongoose = require("mongoose");

async function connectDB(uri) {
  if (!uri) throw new Error("connectDB requires a mongo uri");

  try {
    mongoose.set("strictQuery", false);

    const conn = await mongoose.connect(uri);

    console.log(`MongoDB connected: ${conn.connection.host}`);
    return conn;
  } catch (err) {
    console.error("MongoDB connection error:", err);
    throw err;
  }
}

async function disconnectDB() {
  try {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close(false);
      console.log("MongoDB connection closed.");
    }
  } catch (err) {
    console.warn("Error closing mongo connection", err);
    throw err;
  }
}

module.exports = {
  connectDB,
  disconnectDB,
};
