class refreshTokenService {
  constructor(database) {
    const { models } = database;
    this._database = database;
    this._models = models;
    this._selectOptions = {
      attributes: ["token", "email", "exp_date"],
    };
  }

  async saveToken({ refreshToken, id }) {
    try {
      const { RefreshToken } = this._models;
      const newRefreshToken = await RefreshToken.create({
        token: refreshToken,
        user_id: id,
      });
      console.log(newRefreshToken);
      return true;
    } catch (err) {
      console.log(`Error: ${err}`);
      return false;
    }
  }
}

module.exports = refreshTokenService;
