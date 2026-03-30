const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const { notFound, serverError } = require("./middleware/errorHandler");

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use(notFound);
app.use(serverError);

module.exports = app;
