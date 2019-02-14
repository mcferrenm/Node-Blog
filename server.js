const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const cors = require("cors");

const usersRouter = require("./users/users-router.js");
const postsRouter = require("./posts/posts-router.js");

const server = express();

// Global middleware
server.use(cors());
server.use(express.json());
server.use(helmet());
server.use(morgan("dev"));

// Routes
server.use("/api/users", usersRouter); // restricted middleware removed
server.use("/api/posts", postsRouter);

server.use("/", catchAllErrorHandler);

// Custom middleware defintions

function restricted(req, res, next) {
  const password = req.headers.authorization;
  if (password === "kanye") {
    next();
  } else {
    // test catchAllErrorHandler
    next(err);
    // res.status(401).json({ error: "Not authorized to retrieve users." })
  }
}

function catchAllErrorHandler(err, req, res, next) {
  res.status(500).json({ error: "End of the road" });
}

module.exports = server;
