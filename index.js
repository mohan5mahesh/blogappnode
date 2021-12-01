import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { MongoClient, ObjectId } from "mongodb";
const blog = express();
dotenv.config();
blog.use(cors());
blog.use(express.json());
const PORT = process.env.PORT;
const MONGO_URL = process.env.MONGO_URL;

export async function connectDb() {
  const client = new MongoClient(MONGO_URL);
  await client.connect();
  return client;
}

blog.get("/", (request, response) => {
  response.send("Hello World!");
});

blog.get("/blog", async (request, response) => {
  const result = await getAllBlogs();
  response.send(result);
});
blog.post("/blog", async (request, response) => {
  const data = request.body;
  const result = await addBlogs(data);
  response.send(result);
});

blog.put("/blog/:id", async (request, response) => {
  const { id } = request.params;
  const updateBlogData = request.body;
  const result = await updateBlogs(updateBlogData, id);
  response.send(result);
});

blog.delete("/blog/:id", async (request, response) => {
  const { id } = request.params;
  const result = await deleteBlog(id);
  response.send(result);
});

blog.listen(PORT, () => console.log("Server is started", PORT));

async function getAllBlogs() {
  const client = await connectDb();
  const result = await client
    .db("flipkart")
    .collection("blogs")
    .find({})
    .toArray();
  return result;
}

async function addBlogs(data) {
  const client = await connectDb();
  const result = await client
    .db("flipkart")
    .collection("blogs")
    .insertMany(data);
  return result;
}
async function updateBlogs(updateBlogData, id) {
  const client = await connectDb();
  const result = await client
    .db("flipkart")
    .collection("blogs")
    .updateOne({ _id: ObjectId(id) }, { $set: updateBlogData });
  return result;
}

async function deleteBlog(id) {
  const client = await connectDb();
  const result = await client
    .db("flipkart")
    .collection("blogs")
    .deleteOne({ _id: ObjectId(id) });
  return result;
}
