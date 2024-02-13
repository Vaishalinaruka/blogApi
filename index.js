const express = require("express");
const app = express();
var cors = require("cors");
const path = require("path");

app.use(cors());

const dotenv = require("dotenv");
const mongoose = require("mongoose");
const authRoute = require("./routes/auth");
const userRoute = require("./routes/users");
const postRoute = require("./routes/posts");
const categoryRoute = require("./routes/categories");
const multer = require("multer");

dotenv.config();

app.use(express.json());
app.use("/images", express.static(path.join(__dirname, "/images")));
//It will be used like this http://localhost:5000/images/photo.jpg. This photo.jpg is an image inside images folder.

mongoose
  .connect(process.env.MONGO_URL)
  .then(console.log("Connected to MongoDB"))
  .catch((err) => {
    console.log(err);
  });

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    // cb(null, "hello.jpeg");

    cb(null, req.body.name);
  },
});

const upload = multer({ storage: storage });
app.post("/api/upload", upload.single("file"), (req, res) => {
  res.status(200).json("File has been uploaded");
});

app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/categories", categoryRoute);

app.use("/api/posts", postRoute);

app.listen("5000", () => {
  console.log("Backend is running");
});
