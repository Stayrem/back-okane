const { Router } = require("express");

const { HttpCode } = require("../utlis/constants");

const route = new Router();

const incomeRouter = (app, incomeService) => {
  app.use("/incomes", route);

  route.get("/", (req, res, next) => {
    try {
      const { limit, date } = req.query;
      const incomes = incomeService.findAll({ limit, date });
      return res.status(HttpCode.OK).json(incomes);
    } catch (err) {
      console.log(`Can't get incomes. Error: ${err}`);
      next(err);
    }
  });

  route.post("/", (req, res, next) => {
    try {
      const { name, status, value, user_id } = req.body;
      const newPost = incomeService.create({ name, status, value, user_id });
      return res.status(HttpCode.CREATED).json(newPost);
    } catch (err) {
      console.log(`Can't post incomes. Error: ${err}`);
      next(err);
    }
  });
};

module.exports = incomeRouter;
