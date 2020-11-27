const JWT = require(`jsonwebtoken`);
const { jwt } = require(`../config`);
const {
  jwt: { access_duration, refresh_duration },
} = require("../config");

const makeTokens = (tokenData) => {
  const accessToken = JWT.sign(tokenData, jwt.access_secret, { expiresIn: `${access_duration}` });
  const refreshToken = JWT.sign(tokenData, jwt.refresh_secret, { expiresIn: `${refresh_duration}` });
  return { accessToken, refreshToken };
};

module.exports = {
  makeTokens,
};
