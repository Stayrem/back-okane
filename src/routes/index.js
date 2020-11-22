const { Router } = require("express");
const user = require("./user");
const { UserService } = require("../dataService");
const db = require("../dataBase");

const app = new Router();

user(app, new UserService(db));

module.exports = app;
