const { Router } = require("express");
const { userExistanceCheck, authenticateUser } = require("../middlewares");
const { makeTokens } = require(`../helpers/jwt-helper`);
const { HttpCode } = require("../utlis/constants");

const route = new Router();

const userRouter = (app, userService, refreshTokenService) => {
  app.use("/users", route);

  route.post("/register", userExistanceCheck(userService), async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const newUser = await userService.create({ email, password });
      return res.status(HttpCode.CREATED).json(newUser);
    } catch (err) {
      console.log(`Can't post. Error: ${err}`);
      next(err);
    }
  });

  route.post("/login", authenticateUser(userService), async (req, res, next) => {
    try {
      const { id, email } = res.locals.user;
      const { accessToken, refreshToken } = makeTokens({ id, email });

      await refreshTokenService.saveToken({ refreshToken, id });

      res.status(HttpCode.OK);
      res.set(`accessToken,${accessToken}`);
      res.set(`refreshToken,${refreshToken}`);
      res.set(`userId,${id}`);
      res.set(`userEmail,${email}`);
      res.send();
    } catch (error) {
      console.error(`Can't post user/login. Error:${error.message}`);
      next(error);
    }
  });
};

module.exports = userRouter;
