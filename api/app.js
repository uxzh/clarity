const express = require("express");
const cors = require("cors");
const authorization = require("./src/middleware/authorization");

const app = express();

app.use(cors());

app.use(express.json());

app.use(authorization);

app.use('/api/v1', require('./src/routers/apiRouter'));
app.get("/", (req, res) => {
  res.send("Hello World");
});
app.use("*", (req, res) => {
  res.status(404).send({error: "Not Found"});
});

module.exports = app;
