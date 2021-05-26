const mongoose = require("mongoose");
require("dotenv").config();
const uriDb = process.env.URI_DB;

const db = mongoose.connect(uriDb, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false, // to fix the deprecation warning when using findOneAndUpdate
  poolSize: 5,
});

mongoose.connection.on("connected", () => {
  console.log("Database connection successful");
});

mongoose.connection.on("error", (err) => {
  console.log(`Database connection error: ${err.message}`);
  process.exit(1);
});

mongoose.connection.on("disconnected", () => {
  console.log("Database connection finished");
});

process.on("SIGINT", async () => {
  mongoose.connection.close(() => {
    console.log("Disconnected MongoDB");
    process.exit();
  });
});

module.exports = db;
