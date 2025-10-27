const { MongoClient } = require("mongodb");

const uri = process.env.MONGO_URL;
const client = new MongoClient(uri);

async function connectDB() {
  try {
    await client.connect();
    console.log("MongoDB 연결 성공!");
    return client;
  } catch (err) {
    console.error("MongoDB 연결 실패:", err);
  }
}

module.exports = { connectDB };