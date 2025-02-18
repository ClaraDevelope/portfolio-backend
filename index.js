require('dotenv').config()
const cors = require('cors')
const express = require('express')
const counterRouter = require("./routes/counterRoutes");
const { programarEnvio, enviarReporteVisitas } = require("./config/mailer");
const { connectDB } = require('./config/db');

const app = express();
app.use(cors());
const PORT = 4848;
connectDB()

app.use(express.json());

app.use("/api/v1", counterRouter);

app.use("*", (req, res, next) => {
  return res.status(404).json( "Ruta no encontrada" );
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
