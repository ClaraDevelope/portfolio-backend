const express = require("express");
const { counter, getCounter } = require("./api");


const counterRouter = express.Router();

counterRouter.post("/counter", counter); // Incrementa visitas
counterRouter.get("/counter", getCounter); // Obtiene el número total de visitas

module.exports = counterRouter;
