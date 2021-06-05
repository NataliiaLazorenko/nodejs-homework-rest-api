const path = require("path");
const express = require("express");
const logger = require("morgan");
const cors = require("cors");
const helmet = require("helmet");

const limiter = require("./helpers/limiter");
const usersRouter = require("./routes/api/users");
const contactsRouter = require("./routes/api/contacts");
const { HttpCode } = require("./helpers/constants");

const app = express();

const formatsLogger = app.get("env") === "development" ? "dev" : "short";

app.use(helmet());

// distribution of statics from the folder public
require("dotenv").config();
const PUBLIC_DIR = process.env.PUBLIC_DIR;
app.use(express.static(path.join(__dirname, PUBLIC_DIR)));

app.use(limiter);
app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json({ limit: 15000 }));

app.use("/api/users", usersRouter);
app.use("/api/contacts", contactsRouter);

app.use((_req, res) => {
  res
    .status(HttpCode.NOT_FOUND)
    .json({ status: "error", code: HttpCode.NOT_FOUND, message: "Not found" });
});

app.use((err, _req, res, _next) => {
  const code = err.status || HttpCode.INTERNAL_SERVER_ERROR;
  const status = err.status ? "error" : "fail";
  res.status(code).json({ status, code, message: err.message });
});

module.exports = app;
