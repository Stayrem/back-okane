const moment = require("moment");

class CostService {
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

      let costs;

      switch (typeof date) {
        case "string":
          costs = await user.getCosts({
            limit: limit || 100000,
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
          costs = await user.getCosts({
            limit: limit || 100000,
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
          costs = await user.getCosts({
            limit: limit || 100000,
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

      return costs;
    } catch (err) {
      console.log(err);
      return null;
    }
  }

  async findOne({ user_id, costId }) {
    const { User } = this._models;
    try {
      const user = await User.findByPk(user_id);
      const cost = await user.getCosts({
        where: {
          id: costId,
        },
        ...this._selectOptions,
      });

      return cost;
    } catch (err) {
      console.log(err);
      return null;
    }
  }

  async create({ name, status, value, user_id }) {
    const { User, Cost } = this._models;
    try {
      const user = await User.findByPk(user_id);
      const createNewCost = await user.createCost({
        name,
        status,
        value,
        user_id,
      });
      const newCost = await Cost.findByPk(createNewCost.id, this._selectOptions);

      return newCost;
    } catch (err) {
      console.log(err);
      return null;
    }
  }

  async update({ name, status, value, costId, user_id }) {
    const { Cost } = this._models;

    try {
      await Cost.update(
        {
          name,
          status,
          value,
        },
        {
          where: {
            user_id,
            id: costId,
          },
        }
      );
      const updatedCost = await Cost.findByPk(costId, this._selectOptions);

      return updatedCost;
    } catch (err) {
      console.log(err);
      return null;
    }
  }

  async delete({ costId, user_id }) {
    const { Cost } = this._models;

    try {
      const costDeleteStatus = await Cost.destroy({
        where: {
          user_id,
          id: costId,
        },
      });

      return { status: costDeleteStatus };
    } catch (err) {
      console.log(err);
      return null;
    }
  }
}

module.exports = CostService;
