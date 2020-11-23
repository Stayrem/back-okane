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
      const newCost = await user.getCosts({
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
      return { newCost };
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
