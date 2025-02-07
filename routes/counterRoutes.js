const { counter, getCounter } = require("../api/api");
const counterRouter = require('express').Router();

counterRouter.post("/contador", counter);  
counterRouter.get("/contador/get", getCounter);


module.exports = counterRouter;
