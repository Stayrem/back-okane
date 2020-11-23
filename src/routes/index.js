const { Router } = require("express");
const user = require("./user");
const income = require("./income");
const { UserService, IncomeService, CostService } = require("../dataService");
const db = require("../dataBase");

const app = new Router();

user(app, new UserService(db));
income(app, new IncomeService(db));
cost(app, new CostService(db));

module.exports = app;
