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

      return newRefreshToken;
    } catch (err) {
      console.log(err);
      return null;
    }
  }

  async findByToken({ refreshToken }) {
    try {
      const { RefreshToken } = this._models;
      const storedRefreshToken = await RefreshToken.findOne({
        where: {
          token: refreshToken,
        },
      });

      return storedRefreshToken;
    } catch (err) {
      console.log(err);
      return null;
    }
  }

  async findByUser({ email }) {
    try {
      const { RefreshToken, User } = this._models;
      const userId = await User.findOne({
        where: {
          email,
        },
        attributes: ["id"],
      });
      if (userId) {
        const storedRefreshToken = await RefreshToken.findOne({
          where: {
            user_id: userId.dataValues.id,
          },
        });
        return storedRefreshToken;
      }

      return null;
    } catch (err) {
      console.log(err);
      return null;
    }
  }

  async drop(refreshToken) {
    try {
      const { RefreshToken } = this._models;
      const deleteRefreshToken = await RefreshToken.destroy({
        where: {
          token: refreshToken,
        },
      });

      return { status: deleteRefreshToken };
    } catch (err) {
      console.log(err);
      return null;
    }
  }
}

module.exports = refreshTokenService;
