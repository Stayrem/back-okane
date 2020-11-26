const { Router } = require("express");
const { validateAccessToken } = require("../middlewares");
const { HttpCode } = require("../utlis/constants");

const route = new Router();

const costRouter = (app, costService) => {
  app.use("/costs", route);

  route.get("/", validateAccessToken, async (req, res, next) => {
    try {
      const { limit, date } = req.query;
      const user_id = req.headers["user_id"];
      const costs = await costService.findAll({ limit, date, user_id });

      return res.status(HttpCode.OK).json(costs);
    } catch (err) {
      console.log(`Can't get costs. Error: ${err}`);
      next(err);
    }
  });

  route.get("/:costId", validateAccessToken, async (req, res, next) => {
    try {
      const { costId } = req.params;
      const user_id = req.headers["user_id"];
      const costs = await costService.findOne({ user_id, costId });

      return res.status(HttpCode.OK).json(costs);
    } catch (err) {
      console.log(`Can't get cost. Error: ${err}`);
      next(err);
    }
  });

  route.post("/", validateAccessToken, async (req, res, next) => {
    try {
      const { name, status, value } = req.body;
      const user_id = req.headers["user_id"];
      const newCost = await costService.create({ name, status, value, user_id });

      return res.status(HttpCode.CREATED).json(newCost);
    } catch (err) {
      console.log(`Can't post costs. Error: ${err}`);
      next(err);
    }
  });
  route.put("/:costId", validateAccessToken, async (req, res, next) => {
    try {
      const { costId } = req.params;
      const { name, status, value } = req.body;
      const user_id = req.headers["user_id"];
      const updatedCost = await costService.update({ name, status, value, costId, user_id });

      return res.status(HttpCode.OK).json(updatedCost);
    } catch (err) {
      console.log(`Can't update cost. Error: ${err}`);
      next(err);
    }
  });
  route.delete("/:costId", validateAccessToken, async (req, res, next) => {
    try {
      const { costId } = req.params;
      const user_id = req.headers["user_id"];
      const deletedCost = await costService.delete({ costId, user_id });

      return res.status(HttpCode.OK).json(deletedCost);
    } catch (err) {
      console.log(`Can't delete cost. Error: ${err}`);
      next(err);
    }
  });
};

module.exports = costRouter;
