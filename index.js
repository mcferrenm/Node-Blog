require("dotenv").config();

const server = require("./server.js");

const PORT = process.env.PORT || 4000;

server.get("/", (req, res) => {
  res.status(200).send("Welcome to Node Blog API");
});

// port

server.listen(PORT, (req, res) => {
  console.log(`\n\n*** Listening on port ${PORT} ***\n`);
});
