const { Router } = require("express");

const { HttpCode } = require("../utlis/constants");

const route = new Router();

const userRouter = (app, userService) => {
  app.use("/user", route);

  route.get("/", (req, res, next) => {
    res.send("it works");
  });

  route.post("/", async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const newUser = await userService.create(email, password);
      return res.status(HttpCode.CREATED).json(newUser);
    } catch (err) {
      console.log(`Can't post. Error: ${err}`);
      next(err);
    }
  });
};

module.exports = userRouter;
