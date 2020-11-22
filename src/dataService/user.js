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
      const newUser = await User.create({
        email,
        password,
      });
      return `Created: ${newUser}`;
    } catch (err) {
      console.log(err);
      return `Can't create user. ${err}`;
    }
  }
}

module.exports = UserService;
