const { Router } = require("express");
const { validateAccessToken } = require("../middlewares");
const { HttpCode } = require("../utlis/constants");

const route = new Router();

const costRouter = (app, costService) => {
  app.use("/costs", route);

  route.get("/", validateAccessToken, async (req, res, next) => {
    try {
      const { user_id } = res.locals.user;
      const { limit, date } = req.query;
      const costs = await costService.findAll({ limit, date, user_id });

      return res.status(HttpCode.OK).json(costs);
    } catch (err) {
      console.log(err);
      next(err);
    }
  });

  route.get("/:costId", validateAccessToken, async (req, res, next) => {
    try {
      const { user_id } = res.locals.user;
      const { costId } = req.params;
      const costs = await costService.findOne({ user_id, costId });

      return res.status(HttpCode.OK).json(costs);
    } catch (err) {
      console.log(err);
      next(err);
    }
  });

  route.post("/", validateAccessToken, async (req, res, next) => {
    try {
      const { user_id } = res.locals.user;
      const { name, status, value } = req.body;
      const newCost = await costService.create({ name, status, value, user_id });

      return res.status(HttpCode.CREATED).json(newCost);
    } catch (err) {
      console.log(err);
      next(err);
    }
  });
  route.put("/:costId", validateAccessToken, async (req, res, next) => {
    try {
      const { user_id } = res.locals.user;
      const { costId } = req.params;
      const { name, status, value } = req.body;
      const updatedCost = await costService.update({ name, status, value, costId, user_id });

      return res.status(HttpCode.OK).json(updatedCost);
    } catch (err) {
      console.log(err);
      next(err);
    }
  });
  route.delete("/:costId", validateAccessToken, async (req, res, next) => {
    try {
      const { user_id } = res.locals.user;
      const { costId } = req.params;
      const deletedCost = await costService.delete({ costId, user_id });

      return res.status(HttpCode.OK).json(deletedCost);
    } catch (err) {
      console.log(err);
      next(err);
    }
  });
};

module.exports = costRouter;
