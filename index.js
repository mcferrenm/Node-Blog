require("dotenv").config();

const server = require("./server.js");

const port = process.env.PORT || 4000;

server.get("/", (req, res) => {
  res.status(200).send("Welcome to Node Blog API");
});

// port

server.listen(port, () => {
  console.log(`\n\n*** Listening on port ${port} ***\n`);
});
