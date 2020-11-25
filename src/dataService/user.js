const { compareHash, createHash } = require("../utlis/functions");

class UserService {
  constructor(database) {
    const { models } = database;
    const { User, Income, Cost, Saving, Spending, Saldo } = models;
    this._database = database;
    this._models = models;
  }
  async create({ email, password }) {
    const { User } = this._models;
    try {
      const hash = await createHash(password);
      console.log(hash);
      const newUser = await User.create({
        email,
        password: hash,
      });
      return newUser;
    } catch (err) {
      console.log(err);
      return `Can't create user. ${err}`;
    }
  }

  async checkExistance(email) {
    const { User } = this._models;
    const userEmail = email.trim();
    try {
      const user = await User.findOne({
        where: {
          email: userEmail,
        },
      });
      console.log(user);
      return user;
    } catch (error) {
      console.error(`Can't check existence of user. Error: ${error.message}`);

      return null;
    }
  }

  async checkAuthData({ email, password }) {
    const { User } = this._models;
    try {
      const user = await User.findOne({
        where: {
          email,
        },
      });
      console.log(user);
      if (!user) {
        console.log("no user");
        return false;
      }
      console.log(user.dataValues.password);
      const passwordMatch = await compareHash(password, user.dataValues.password);
      console.log(passwordMatch);
      if (!passwordMatch) {
        console.log("no match");
        return false;
      }
      return user;
    } catch (err) {
      console.log(err);
      return false;
    }
  }
}

module.exports = UserService;
