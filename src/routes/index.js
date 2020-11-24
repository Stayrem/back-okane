const { Router } = require("express");
const user = require("./user");
const income = require("./income");
const cost = require("./cost");
const spending = require("./spending");
const saving = require("./saving");
const { UserService, IncomeService, CostService, SpendingService, SavingService } = require("../dataService");
const db = require("../dataBase");

const app = new Router();

user(app, new UserService(db));
income(app, new IncomeService(db));
cost(app, new CostService(db));
spending(app, new SpendingService(db));
saving(app, new SavingService(db));

module.exports = app;
