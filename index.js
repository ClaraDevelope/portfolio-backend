require('dotenv').config()
const express = require('express')
const cors = require('cors')
const counterRouter = require("./routes/counterRoutes");
const { programarEnvio, enviarReporteVisitas } = require("./config/mailer");

const app = express();
app.use(cors());

app.use(express.json());

app.use("/api/v1", counterRouter);
app.use("*", (req, res, next) => {
  return res.status(404).json( "Ruta no encontrada" );
});

const PORT = process.env.PORT || 4848;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
//   enviarReporteVisitas()
  programarEnvio()
});
