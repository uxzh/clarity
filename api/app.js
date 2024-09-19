const express = require("express");
const cors = require("cors");
const { auth } = require("./src/middleware/auth");

const app = express();

app.use(cors());

app.use(express.json());

app.use(auth);

app.use('/api/v1', require('./src/routers/apiRouter'));
app.use("*", (req, res) => {
  res.status(404).send({error: "Not Found"});
});

module.exports = app;
