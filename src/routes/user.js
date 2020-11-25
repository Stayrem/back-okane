const { Router } = require("express");
const { userExistanceCheck } = require("../middlewares");
const { HttpCode } = require("../utlis/constants");

const route = new Router();

const userRouter = (app, userService) => {
  app.use("/users", route);

  route.get("/", (req, res, next) => {
    res.send("it works");
  });

  route.post("/", userExistanceCheck, async (req, res, next) => {
    try {
      console.log(req.body);
      const { email, password } = req.body;
      const newUser = await userService.create({ email, password });
      return res.status(HttpCode.CREATED).json(newUser);
    } catch (err) {
      console.log(`Can't post. Error: ${err}`);
      next(err);
    }
  });
};

module.exports = userRouter;
