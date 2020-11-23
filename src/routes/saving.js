const { Router } = require("express");

const { HttpCode } = require("../utlis/constants");

const route = new Router();

const savingRouter = (app, savingService) => {
  app.use("/savings", route);

  route.get("/", async (req, res, next) => {
    try {
      const { limit, date } = req.query;
      const user_id = req.headers["user_id"];
      const savings = await savingService.findAll({ limit, date, user_id });

      return res.status(HttpCode.OK).json(savings);
    } catch (err) {
      console.log(`Can't get savings. Error: ${err}`);
      next(err);
    }
  });

  route.post("/", async (req, res, next) => {
    try {
      const { value } = req.body;
      const user_id = req.headers["user_id"];
      const newSaving = await savingService.createOrUpdate({ value, user_id });

      return res.status(HttpCode.OK).json(newSaving);
    } catch (err) {
      console.log(`Can't post savings. Error: ${err}`);
      next(err);
    }
  });

  route.delete("/:savingId", async (req, res, next) => {
    try {
      const { savingId } = req.params;
      const user_id = req.headers["user_id"];
      const deletedSaving = await savingService.delete({ savingId, user_id });

      return res.status(HttpCode.OK).json(deletedSaving);
    } catch (err) {
      console.log(`Can't delete saving. Error: ${err}`);
      next(err);
    }
  });
};

module.exports = savingRouter;
