const mongoose = require("mongoose");
const { createClient } = require("redis");

const redisClient = createClient({
  url: "redis://redis:6379",
});

const dbConnection = async () => {
  try {
    await mongoose.connect(
      `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@mongo:27017/myData?authSource=admin`
    );
    await redisClient.connect();
    console.log("✅ connection to database successfully");
  } catch (e) {
    console.log(e);
  }
};
module.exports = { dbConnection, redisClient };
