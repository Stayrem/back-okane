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
    if (date && date.split(" ").length > 1) date = date.split(" ");
    try {
      const user = await User.findByPk(user_id);

      let spendings;

      switch (typeof date) {
        case "string":
          spendings = await user.getSpendings({
            limit: limit || 100000,
            where: {
              date,
              user_id,
            },
            ...this._selectOptions,
          });
          break;
        case "object":
          spendings = await user.getSpendings({
            limit: limit || 100000,
            where: {
              date: { [sequelize.Sequelize.Op.between]: [date[0], date[1]] },
              user_id,
            },
            ...this._selectOptions,
          });
          break;
        default:
          spendings = await user.getSpendings({
            limit: limit || 100000,
            where: {
              date: sequelize.where(
                sequelize.fn("date", sequelize.col("date")),
                "<=",
                moment(new Date()).format("YYYY-MM-DD")
              ),
              user_id,
            },
            ...this._selectOptions,
          });
      }

      return spendings;
    } catch (err) {
      console.log(err);
      return null;
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
      return null;
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
      return null;
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
      return null;
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

      return { status: spendingDeleteStatus };
    } catch (err) {
      console.log(err);
      return null;
    }
  }
}

module.exports = SpendingService;
