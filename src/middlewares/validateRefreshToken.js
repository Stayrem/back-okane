const { HttpCode } = require("../utlis/constants");
const JWT = require("jsonwebtoken");
const { jwt } = require("../config");

module.exports = (service) => async (req, res, next) => {
  console.log("start middleware");
  const refreshToken = req.headers["refreshtoken"];
  if (!refreshToken) {
    return res.status(HttpCode.BAD_REQUEST);
  }

  const storedRefreshToken = await service.findByToken({ refreshToken });
  if (!storedRefreshToken) {
    return res.status(HttpCode.NOT_FOUND);
  }

  const verifyToken = await JWT.verify(storedRefreshToken.dataValues.token, jwt.refresh_secret, (err, userData) => {
    if (err) {
      return false;
    }
    return true;
  });
  if (!verifyToken) {
    console.log("jwt error");
    return res.status(HttpCode.FORBIDDEN);
  }
  res.locals.refToken = refreshToken;
  next();
};
