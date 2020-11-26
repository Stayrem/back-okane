const moment = require("moment");

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

  async findAll({ limit, date, user_id }) {
    const { sequelize } = this._database;
    const { User } = this._models;
    try {
      const user = await User.findByPk(user_id);
      const incomes = await user.getIncomes({
        limit: limit || 100,
        where: {
          date:
            date ||
            sequelize.where(sequelize.fn("date", sequelize.col("date")), "<=", moment(new Date()).format("YYYY-MM-DD")),
          user_id,
        },
        ...this._selectOptions,
      });
      console.log(incomes);
      return incomes;
    } catch (err) {
      console.log(err);
      return false;
    }
  }

  async findOne({ user_id, incomeId }) {
    const { User } = this._models;
    try {
      const user = await User.findByPk(user_id);
      const income = await user.getIncomes({
        where: {
          id: incomeId,
        },
        ...this._selectOptions,
      });
      return income;
    } catch (err) {
      console.log(err);
      return false;
    }
  }

  async create({ name, status, value, user_id }) {
    const { User, Income } = this._models;
    try {
      const user = await User.findByPk(user_id);
      const createNewIncome = await user.createIncome({
        name,
        status,
        value,
        user_id,
      });
      const newIncome = await Income.findByPk(createNewIncome.id, this._selectOptions);
      return newIncome;
    } catch (err) {
      console.log(err);
      return false;
    }
  }

  async update({ name, status, value, incomeId, user_id }) {
    const { Income } = this._models;

    try {
      await Income.update(
        {
          name,
          status,
          value,
        },
        {
          where: {
            user_id,
            id: incomeId,
          },
        }
      );
      const updatedIncome = await Income.findByPk(incomeId, this._selectOptions);
      return updatedIncome;
    } catch (err) {
      console.log(err);
      return false;
    }
  }

  async delete({ incomeId, user_id }) {
    const { Income } = this._models;

    try {
      const incomeDeleteStatus = await Income.destroy({
        where: {
          user_id,
          id: incomeId,
        },
      });
      return { status: incomeDeleteStatus };
    } catch (err) {
      console.log(err);
      return false;
    }
  }
}

module.exports = IncomeService;
