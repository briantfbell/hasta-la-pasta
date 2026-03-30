const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const ingredientsRouter = require("./routes/ingredients");
const pastaTypesRouter = require("./routes/pastaTypes");
const recipesRouter = require("./routes/recipes");

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.json({ message: "Hasta la Pasta API is running" });
});

app.use("/api/ingredients", ingredientsRouter);
app.use("/api/pasta-types", pastaTypesRouter);
app.use("/api/recipes", recipesRouter);

app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: err.message || "Internal server error",
  });
});

module.exports = app;
