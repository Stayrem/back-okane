const { compareHash, createHash } = require("../utlis/functions");

class UserService {
  constructor(database) {
    const { models } = database;
    this._database = database;
    this._models = models;
    this._selectOptions = {
      attributes: ["id", "sign_up_date", "email"],
    };
  }
  async create({ email, password }) {
    const { User } = this._models;
    try {
      const hash = await createHash(password);
      const newUser = await User.create(
        {
          email,
          password: hash,
        },
        this._selectOptions
      );

      return newUser;
    } catch (err) {
      console.log(err);
      return null;
    }
  }

  async checkExistance(email) {
    const { User } = this._models;
    const userEmail = email.trim();
    try {
      const user = await User.findOne(
        {
          where: {
            email: userEmail,
          },
        },
        this._selectOptions
      );

      return user;
    } catch (err) {
      console.error(err);

      return null;
    }
  }

  async checkAuthData({ email, password }) {
    const { User } = this._models;
    try {
      const user = await User.findOne(
        {
          where: {
            email,
          },
        },
        this._selectOptions
      );
      if (!user) return null;
      const passwordMatch = await compareHash(password, user.dataValues.password);
      if (!passwordMatch) return false;

      return user;
    } catch (err) {
      console.log(err);
      return null;
    }
  }
}

module.exports = UserService;
