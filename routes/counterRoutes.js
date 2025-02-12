const { counter, getCounter } = require("../api/api");
const counterRouter = require('express').Router();

counterRouter.get("/contador/", getCounter);
counterRouter.post("/contador/post", counter);  



module.exports = counterRouter;
