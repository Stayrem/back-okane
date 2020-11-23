class IncomeService {
  constructor(database) {
    const { models } = database;
    this._database = database;
    this._models = models;
    this._selectOptions = {
      attributes: ["id", "name", "value", "status", "date"],
      order: [[`date`, `DESC`]],
    };
  }
  async create({ name, status, value, user_id }) {
    const { User, Income } = this._models;
    try {
      const user = await User.findByPk(user_id);
      const newIncome = await user.createIncome({
        name,
        status,
        value,
        user_id,
      });
      return await Income.findByPk(newIncome.id, this._selectOptions);
    } catch (err) {
      console.log(err);
      return false;
    }
  }
  async findAll({ limit, date, user_id }) {
    const { sequelize } = this._database;
    const { User } = this._models;

    try {
      const user = await User.findByPk(user_id);
      const newIncome = await user.getIncomes({
        limit: limit || 100,
        where: {
          date:
            date ||
            sequelize.where(
              sequelize.fn("date", sequelize.col("date")),
              "<=",
              new Date().toISOString().substring(0, 10)
            ),
          user_id,
        },
        ...this._selectOptions,
      });
      return { newIncome };
    } catch (err) {
      console.log(err);
      return false;
    }
  }
}

module.exports = IncomeService;
