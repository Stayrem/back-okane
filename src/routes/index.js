const { Router } = require("express");
const income = require("./income");

const db = require("../dataBase");

const app = new Router();

income(app);

module.exports = app;
