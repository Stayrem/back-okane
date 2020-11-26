const { Router } = require("express");
const { userExistanceCheck, authenticateUser, validateRefreshToken } = require("../middlewares");
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
      const { id: user_id, email: user_email } = res.locals.user;
      const { accessToken, refreshToken } = makeTokens({ user_id, user_email });

      await refreshTokenService.save({ refreshToken, user_id });

      res.status(HttpCode.OK);
      res.header("accessToken", `${accessToken}`);
      res.header("refreshToken", `${refreshToken}`);
      res.header("userId", `${user_id}`);
      res.header("userEmail", `${user_email}`);
      res.send();
    } catch (error) {
      console.error(`Can't post user/login. Error:${error.message}`);
      next(error);
    }
  });

  route.post(`/logout`, validateRefreshToken(refreshTokenService), async (req, res, next) => {
    try {
      const refreshToken = res.locals.refToken;
      console.log(`refreshToken before drop ${refreshToken}`);
      const deletedTokenStatus = await refreshTokenService.drop({ refreshToken });
      console.log("after delete");
      res.status(HttpCode.NO_CONTENT);
      res.end();
    } catch (error) {
      console.error(`Can't delete user/logout. Error:${error}`);
      next(error);
    }
  });
};

module.exports = userRouter;
