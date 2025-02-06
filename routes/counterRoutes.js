const express = require("express");
const { counter, getCounter } = require("../api/api");
const counterRouter = express.Router();

counterRouter.post("/contador", counter);  // Ruta para incrementar el contador
counterRouter.get("/contador/get", getCounter);  // Ruta para obtener el contador actual

// Exporta el enrutador para usarlo en otro archivo
module.exports = counterRouter;
