const { HttpCode } = require("../utlis/constants");
const JWT = require("jsonwebtoken");
const { jwt } = require("../config");

module.exports = (req, res, next) => {
  const authorization = req.headers[`authorization`];
  if (!authorization) {
    return res.status(HttpCode.UNAUTHORIZED);
  }

  const [, token] = authorization.split(` `);

  if (!token) {
    return res.status(HttpCode.UNAUTHORIZED);
  }

  const verifyToken = await jwt.verify(token, jwt_access_secret, (err, userData) => {
    if (err) {
      return false;
    }
    return userData;
  });
  if (!verifyToken) {
    return res.status(HttpCode.FORBIDDEN);
  }

  res.locals.user = verifyToken; // user data
  res.locals.token = token; // user token
  next();
};
