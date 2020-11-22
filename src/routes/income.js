const { Router } = require("express");

const { HttpCode } = require("../utlis/constants");

const route = new Router();

const incomeRouter = (app, incomeService) => {
  app.use("/income", route);

  route.get("/", (req, res, next) => {
    res.send("it works");
  });

  route.post("/", (req, res, next) => {
    const { name, status, value } = req.body;

    res.send("it works");
  });
};

module.exports = incomeRouter;
