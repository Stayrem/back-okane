const { Router } = require("express");
const { userExistanceCheck, authenticateUser, validateRefreshToken, tokenExistanceCheck } = require("../middlewares");
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
      console.log(err);
      next(err);
    }
  });

  route.post(
    "/login",
    [authenticateUser(userService), tokenExistanceCheck(refreshTokenService)],
    async (req, res, next) => {
      try {
        const { id: user_id, email: user_email } = res.locals.user;
        const { accessToken, refreshToken } = makeTokens({ user_id, user_email });

        await refreshTokenService.save({ refreshToken, user_id });

        res.status(HttpCode.OK);
        res.header("accessToken", `${accessToken}`);
        res.header("refreshToken", `${refreshToken}`);
        res.end();
      } catch (err) {
        console.error(err);
        next(err);
      }
    }
  );

  route.post(`/logout`, validateRefreshToken(refreshTokenService), async (req, res, next) => {
    try {
      const refreshToken = res.locals.token;
      const deletedTokenStatus = await refreshTokenService.drop(refreshToken);
      res.status(HttpCode.NO_CONTENT);
      res.end();
    } catch (err) {
      console.error(err);
      next(err);
    }
  });

  route.post(`/refresh`, validateRefreshToken(refreshTokenService), async (req, res, next) => {
    try {
      const { user_id, user_email } = res.locals.user;
      const existToken = res.locals.token;
      const { accessToken, refreshToken } = makeTokens({ user_id, user_email });

      await refreshTokenService.drop(existToken);
      await refreshTokenService.save({ refreshToken, user_id });
      res.status(HttpCode.OK);
      res.header("accessToken", `${accessToken}`);
      res.header("refreshToken", `${refreshToken}`);
      res.end();
    } catch (err) {
      console.error(err);
      next(err);
    }
  });
};

module.exports = userRouter;
