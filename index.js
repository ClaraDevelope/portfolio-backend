require("dotenv").config();
const cors = require("cors");
const express = require("express");
const { connectDB } = require("./config/db");
const counterRouter = require("./api/counterRouter");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 4848;
connectDB();

app.use("/api/v1", counterRouter);

app.use("*", (req, res, next) => {
  return res.status(404).json("Ruta no encontrada");
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
