const { Router } = require("express");
const user = require("./user");
const income = require("./income");
const { UserService } = require("../dataService");
const { IncomeService } = require("../dataService");
const db = require("../dataBase");

const app = new Router();

user(app, new UserService(db));
income(app, new IncomeService(db));

module.exports = app;
