class refreshTokenService {
  constructor(database) {
    const { models } = database;
    this._database = database;
    this._models = models;
    this._selectOptions = {
      attributes: ["token", "email", "exp_date"],
    };
  }

  async save({ refreshToken, user_id }) {
    try {
      const { RefreshToken } = this._models;
      const newRefreshToken = await RefreshToken.create({
        token: refreshToken,
        user_id,
      });
      return true;
    } catch (err) {
      console.log(`Error: ${err}`);
      return false;
    }
  }

  async find({ refreshToken }) {
    try {
      console.log("find");
      console.log(refreshToken);
      const { RefreshToken } = this._models;
      const storedRefreshToken = await RefreshToken.findOne({
        where: {
          token: refreshToken,
        },
      });
      console.log("found");
      console.log(storedRefreshToken);
      return storedRefreshToken;
    } catch (err) {
      console.log(`Error: ${err}`);
      return false;
    }
  }

  async drop({ refreshToken }) {
    try {
      const { RefreshToken } = this._models;
      const deleteRefreshToken = await RefreshToken.destroy({
        where: {
          token: refreshToken,
        },
      });
      console.log(`deleted ${deleteRefreshToken}`);
      return deleteRefreshToken;
    } catch (err) {
      console.log(`Error: ${err}`);
      return false;
    }
  }
}

module.exports = refreshTokenService;
