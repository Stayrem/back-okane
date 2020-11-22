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
      console.log(incomes);
      return res.status(HttpCode.OK).json(incomes);
    } catch (err) {
      console.log(`Can't get incomes. Error: ${err}`);
      next(err);
    }
  });

  route.post("/", async (req, res, next) => {
    try {
      // TODO: будем получать user_ui из куков
      const { name, status, value, user_id } = req.body;
      const newPost = await incomeService.create({ name, status, value, user_id });
      console.log(newPost);
      return res.status(HttpCode.CREATED).json(newPost);
    } catch (err) {
      console.log(`Can't post incomes. Error: ${err}`);
      next(err);
    }
  });
};

module.exports = incomeRouter;
