const { HttpCode } = require("../utlis/constants");
const JWT = require("jsonwebtoken");
const { jwt } = require("../config");

module.exports = (service) => async (req, res, next) => {
  console.log("start middleware");
  const refreshToken = req.headers["refreshtoken"];
  if (!refreshToken) {
    return res.sendStatus(HttpCode.BAD_REQUEST);
  }

  const storedRefreshToken = await service.find({ refreshToken });
  if (!storedRefreshToken) {
    return res.sendStatus(HttpCode.NOT_FOUND);
  }

  JWT.verify(storedRefreshToken.dataValues.token, jwt.refresh_secret, async (err, userData) => {
    if (err) {
      res.satatus(HttpCode.FORBIDDEN);
      res.end();
    }
  });
  res.locals.refToken = refreshToken;
  next();
};
