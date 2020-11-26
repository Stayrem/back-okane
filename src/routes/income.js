const { Router } = require("express");
const { validateAccessToken } = require("../middlewares");
const { HttpCode } = require("../utlis/constants");

const route = new Router();

const incomeRouter = (app, incomeService) => {
  app.use("/incomes", route);

  route.get("/", validateAccessToken, async (req, res, next) => {
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

  route.get("/:incomeId", validateAccessToken, async (req, res, next) => {
    try {
      const { incomeId } = req.params;
      const user_id = req.headers["user_id"];
      const incomes = await incomeService.findOne({ user_id, incomeId });

      return res.status(HttpCode.OK).json(incomes);
    } catch (err) {
      console.log(`Can't get income. Error: ${err}`);
      next(err);
    }
  });

  route.post("/", validateAccessToken, async (req, res, next) => {
    try {
      const { name, status, value } = req.body;
      const user_id = req.headers["user_id"];
      const newIncome = await incomeService.create({ name, status, value, user_id });

      return res.status(HttpCode.CREATED).json(newIncome);
    } catch (err) {
      console.log(`Can't post incomes. Error: ${err}`);
      next(err);
    }
  });
  route.put("/:incomeId", validateAccessToken, async (req, res, next) => {
    try {
      const { incomeId } = req.params;
      const { name, status, value } = req.body;
      const user_id = req.headers["user_id"];
      const updatedIncome = await incomeService.update({ name, status, value, incomeId, user_id });

      return res.status(HttpCode.OK).json(updatedIncome);
    } catch (err) {
      console.log(`Can't update income. Error: ${err}`);
      next(err);
    }
  });
  route.delete("/:incomeId", validateAccessToken, async (req, res, next) => {
    try {
      const { incomeId } = req.params;
      const user_id = req.headers["user_id"];
      const deletedIncome = await incomeService.delete({ incomeId, user_id });

      return res.status(HttpCode.OK).json(deletedIncome);
    } catch (err) {
      console.log(`Can't delete income. Error: ${err}`);
      next(err);
    }
  });
};

module.exports = incomeRouter;
