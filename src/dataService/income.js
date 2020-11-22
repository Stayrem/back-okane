class IncomeService {
  constructor(database) {
    const { models } = database;
    this._database = database;
    this._models = models;
  }
  async create({ name, status, value, user_id }) {
    const { User } = this._models;
    try {
      const user = await User.findByPk(user_id);
      console.log(user);
      const newIncome = await user.createIncome({
        name,
        status,
        value,
        user_id,
      });
      return { newIncome };
    } catch (err) {
      console.log(err);
      return false;
    }
  }
  async findAll({ limit, date }) {
    const { sequelize } = this._database;
    const { Income } = this._models;

    try {
      const newIncome = await Income.findAll({
        limit: limit || 100,
        where: {
          date:
            date ||
            sequelize.where(
              sequelize.fn("date", sequelize.col("date")),
              "<=",
              new Date().toISOString().substring(0, 10)
            ),
        },
      });
      return { newIncome };
    } catch (err) {
      console.log(err);
      return false;
    }
  }
}

module.exports = IncomeService;
