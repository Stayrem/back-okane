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
  async findAll({ limit, date, user_id, status }) {
    const { sequelize } = this._database;
    const { User } = this._models;
    if (date && date.split(" ").length > 1) date = date.split(" ");
    try {
      const user = await User.findByPk(user_id);
      let incomes;
      //TODO: Need to call sequelize guru here
      switch (typeof date) {
        case "string":
          incomes = await user.getIncomes({
            limit: limit || 100,
            where: {
              date,
              user_id,
              status: status || {
                [sequelize.Sequelize.Op.not]: null,
              },
            },
            ...this._selectOptions,
          });
          break;
        case "object":
          incomes = await user.getIncomes({
            limit: limit || 100,
            where: {
              date: { [sequelize.Sequelize.Op.between]: [date[0], date[1]] },
              user_id,
              status: status || {
                [sequelize.Sequelize.Op.not]: null,
              },
            },
            ...this._selectOptions,
          });
          break;
        default:
          incomes = await user.getIncomes({
            limit: limit || 100,
            where: {
              date: sequelize.where(
                sequelize.fn("date", sequelize.col("date")),
                "<=",
                moment(new Date()).format("YYYY-MM-DD")
              ),
              user_id,
              status: status || {
                [sequelize.Sequelize.Op.not]: null,
              },
            },
            ...this._selectOptions,
          });
      }

      //attempts

      /*  incomes = await user.getIncomes({
        limit: limit || 100,
        where: sequelize.Sequelize.or(
          typeof data === "string"
            ? { date: date, user_id: user_id }
            : typeof data === "object"
            ? { date: { [sequelize.Sequelize.Op.between]: [date[0], date[1]] }, user_id }
            : {
                date: sequelize.where(
                  sequelize.fn("date", sequelize.col("date")),
                  "<=",
                  moment(new Date()).format("YYYY-MM-DD")
                ),
                user_id,
              }
        ),
        ...this._selectOptions,
      }); */
      /*  incomes = await user.getIncomes({
        limit: limit || 100,
        where: {
          date: {
            [Op.or]: {
              date: {
                [Op.eq]: date,
                [Op.between]: [date[0], date[1]],
                [Op.lte]: moment(new Date()).format("YYYY-MM-DD"),
              },
            },
          },
          user_id,
        },
        ...this._selectOptions,
      }); */

      return incomes;
    } catch (err) {
      console.log(err);
      return null;
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
      return null;
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
      return null;
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
      return null;
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
      return null;
    }
  }
}

module.exports = IncomeService;
