const { Router } = require("express");
const { validateAccessToken } = require("../middlewares");
const { HttpCode } = require("../utlis/constants");

const route = new Router();

const savingRouter = (app, savingService) => {
  app.use("/savings", route);

  route.get("/", validateAccessToken, async (req, res, next) => {
    try {
      const { limit, date } = req.query;
      const { user_id } = res.locals.user;
      const savings = await savingService.findAll({ limit, date, user_id });

      return res.status(HttpCode.OK).json(savings);
    } catch (err) {
      console.log(err);
      next(err);
    }
  });

  route.get("/:savingId", validateAccessToken, async (req, res, next) => {
    try {
      const { savingId } = req.params;
      const { user_id } = res.locals.user;
      const savings = await savingService.findOne({ user_id, savingId });

      return res.status(HttpCode.OK).json(savings);
    } catch (err) {
      console.log(err);
      next(err);
    }
  });

  route.post("/", validateAccessToken, async (req, res, next) => {
    try {
      const { value } = req.body;
      const { user_id } = res.locals.user;
      const newSaving = await savingService.create({ value, user_id });

      return res.status(HttpCode.CREATED).json(newSaving);
    } catch (err) {
      console.log(err);
      next(err);
    }
  });
  route.put("/:savingId", validateAccessToken, async (req, res, next) => {
    try {
      const { savingId } = req.params;
      const { value } = req.body;
      const { user_id } = res.locals.user;
      const updatedSaving = await savingService.update({ value, savingId, user_id });

      return res.status(HttpCode.OK).json(updatedSaving);
    } catch (err) {
      console.log(err);
      next(err);
    }
  });

  route.delete("/:savingId", validateAccessToken, async (req, res, next) => {
    try {
      const { savingId } = req.params;
      const { user_id } = res.locals.user;
      const deletedSaving = await savingService.delete({ savingId, user_id });

      return res.status(HttpCode.OK).json(deletedSaving);
    } catch (err) {
      console.log(err);
      next(err);
    }
  });
};

module.exports = savingRouter;
