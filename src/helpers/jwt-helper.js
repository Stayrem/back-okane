const JWT = require(`jsonwebtoken`);
const { jwt } = require(`../config`);

const makeTokens = (tokenData) => {
  const accessToken = JWT.sign(tokenData, jwt.access_secret, { expiresIn: `30m` });
  const refreshToken = JWT.sign(tokenData, jwt.refresh_secret, { expiresIn: `1d` });
  return { accessToken, refreshToken };
};

module.exports = {
  makeTokens,
};
