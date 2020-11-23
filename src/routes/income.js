const { Router } = require("express");

const { HttpCode } = require("../utlis/constants");

const route = new Router();

const incomeRouter = (app, incomeService) => {
  app.use("/incomes", route);

  route.get("/", async (req, res, next) => {
    try {
      const { limit, date } = req.query;
      const user_id = req.headers["user_id"];
      const incomes = await incomeService.findAll({ limit, date, user_id });

      return res.status(HttpCode.OK).json(incomes);
    } catch (err) {
      console.log(`Can't get incomes. Error: ${err}`);
      next(err);
    }
  });

  route.post("/", async (req, res, next) => {
    try {
      const { name, status, value } = req.body;
      const user_id = req.headers["user_id"];
      const newPost = await incomeService.create({ name, status, value, user_id });

      return res.status(HttpCode.CREATED).json(newPost);
    } catch (err) {
      console.log(`Can't post incomes. Error: ${err}`);
      next(err);
    }
  });
};

module.exports = incomeRouter;
