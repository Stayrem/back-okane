const moment = require("moment");

class SavingService {
  constructor(database) {
    const { models } = database;
    this._database = database;
    this._models = models;
    this._selectOptions = {
      attributes: ["id", "value", "date"],
      order: [[`date`, `DESC`]],
    };
  }

  async findAll({ limit, date, user_id }) {
    const { sequelize } = this._database;
    const { User } = this._models;
    if (date && date.split(" ").length > 1) date = date.split(" ");
    try {
      const user = await User.findByPk(user_id);

      let savings;

      switch (typeof date) {
        case "string":
          savings = await user.getSavings({
            limit: limit || 100,
            where: {
              date,
              user_id,
            },
            ...this._selectOptions,
          });
          break;
        case "object":
          savings = await user.getSavings({
            limit: limit || 100,
            where: {
              date: { [sequelize.Sequelize.Op.between]: [date[0], date[1]] },
              user_id,
            },
            ...this._selectOptions,
          });
          break;
        default:
          savings = await user.getSavings({
            limit: limit || 100,
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
      return savings;
    } catch (err) {
      console.log(err);
      return false;
    }
  }

  async findOne({ user_id, savingId }) {
    const { User } = this._models;
    try {
      const user = await User.findByPk(user_id);
      const saving = await user.getSavings({
        where: {
          id: savingId,
        },
        ...this._selectOptions,
      });
      return saving;
    } catch (err) {
      console.log(err);
      return false;
    }
  }

  async create({ value, user_id }) {
    const { User, Saving } = this._models;
    try {
      const user = await User.findByPk(user_id);
      const createNewSaving = await user.createSaving({
        value,
        user_id,
      });
      const newSaving = await Saving.findByPk(createNewSaving.id, this._selectOptions);
      return newSaving;
    } catch (err) {
      console.log(err);
      return false;
    }
  }

  async update({ value, savingId, user_id }) {
    const { Saving } = this._models;
    try {
      await Saving.update(
        {
          value,
        },
        {
          where: {
            user_id,
            id: savingId,
          },
        }
      );
      const updatedSaving = await Saving.findByPk(savingId, this._selectOptions);
      return updatedSaving;
    } catch (err) {
      console.log(err);
      return false;
    }
  }

  async delete({ savingId, user_id }) {
    const { Saving } = this._models;

    try {
      const savingDeleteStatus = await Saving.destroy({
        where: {
          user_id,
          id: savingId,
        },
      });
      return { status: savingDeleteStatus };
    } catch (err) {
      console.log(err);
      return false;
    }
  }
}

module.exports = SavingService;
