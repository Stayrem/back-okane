const { Router } = require("express");
const user = require("./user");
const income = require("./income");
const cost = require("./cost");
const spending = require("./spending");
const { UserService, IncomeService, CostService, SpendingService } = require("../dataService");
const db = require("../dataBase");

const app = new Router();

user(app, new UserService(db));
income(app, new IncomeService(db));
cost(app, new CostService(db));
spending(app, new SpendingService(db));

module.exports = app;
