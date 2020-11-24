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

  async findAll({ limit, date, user_id }) {
    const { sequelize } = this._database;
    const { User } = this._models;
    try {
      const user = await User.findByPk(user_id);
      const costs = await user.getCosts({
        limit: limit || 100,
        where: {
          date:
            date ||
            sequelize.where(sequelize.fn("date", sequelize.col("date")), "<=", moment(new Date()).format("YYYY-MM-DD")),
          user_id,
        },
        ...this._selectOptions,
      });
      return { costs };
    } catch (err) {
      console.log(err);
      return false;
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
      return { cost };
    } catch (err) {
      console.log(err);
      return false;
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
      return { newCost };
    } catch (err) {
      console.log(err);
      return false;
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
      return { updatedCost };
    } catch (err) {
      console.log(err);
      return false;
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
      return { costDeleteStatus };
    } catch (err) {
      console.log(err);
      return false;
    }
  }
}

module.exports = CostService;
