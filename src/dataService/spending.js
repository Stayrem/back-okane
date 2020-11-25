const moment = require("moment");

class SpendingService {
  constructor(database) {
    const { models } = database;
    this._database = database;
    this._models = models;
    this._selectOptions = {
      attributes: ["id", "name", "value", "date"],
      order: [[`date`, `DESC`]],
    };
  }

  async findAll({ limit, date, user_id }) {
    const { sequelize } = this._database;
    const { User } = this._models;
    try {
      const user = await User.findByPk(user_id);
      const spendings = await user.getSpendings({
        limit: limit || 100,
        where: {
          date:
            date ||
            sequelize.where(sequelize.fn("date", sequelize.col("date")), "<=", moment(new Date()).format("YYYY-MM-DD")),
          user_id,
        },
        ...this._selectOptions,
      });
      return spendings;
    } catch (err) {
      console.log(err);
      return false;
    }
  }

  async findOne({ user_id, spendingId }) {
    const { User } = this._models;
    try {
      const user = await User.findByPk(user_id);
      const spending = await user.getSpendings({
        where: {
          id: spendingId,
        },
        ...this._selectOptions,
      });
      return spending;
    } catch (err) {
      console.log(err);
      return false;
    }
  }

  async create({ name, value, user_id }) {
    const { User, Spending } = this._models;
    try {
      const user = await User.findByPk(user_id);
      const createNewSpending = await user.createSpending({
        name,
        value,
        user_id,
      });
      const newSpending = await Spending.findByPk(createNewSpending.id, this._selectOptions);
      return newSpending;
    } catch (err) {
      console.log(err);
      return false;
    }
  }

  async update({ name, value, spendingId, user_id }) {
    const { Spending } = this._models;
    try {
      await Spending.update(
        {
          name,
          value,
        },
        {
          where: {
            user_id,
            id: spendingId,
          },
        }
      );
      const updatedSpending = await Spending.findByPk(spendingId, this._selectOptions);
      return updatedSpending;
    } catch (err) {
      console.log(err);
      return false;
    }
  }

  async delete({ spendingId, user_id }) {
    const { Spending } = this._models;

    try {
      const spendingDeleteStatus = await Spending.destroy({
        where: {
          user_id,
          id: spendingId,
        },
      });
      return spendingDeleteStatus;
    } catch (err) {
      console.log(err);
      return false;
    }
  }
}

module.exports = SpendingService;
