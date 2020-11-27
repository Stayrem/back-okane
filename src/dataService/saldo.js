const moment = require("moment");

class saldoService {
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

      let saldos;

      switch (typeof date) {
        case "string":
          saldos = await user.getSaldo({
            limit: limit || 100,
            where: {
              date,
              user_id,
            },
            ...this._selectOptions,
          });
          break;
        case "object":
          saldos = await user.getSaldo({
            limit: limit || 100,
            where: {
              date: { [sequelize.Sequelize.Op.between]: [date[0], date[1]] },
              user_id,
            },
            ...this._selectOptions,
          });
          break;
        default:
          saldos = await user.getSaldo({
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
      return saldos;
    } catch (err) {
      console.log(err);
      return false;
    }
  }

  async findOne({ user_id, saldoId }) {
    const { User } = this._models;
    try {
      const user = await User.findByPk(user_id);
      const saldo = await user.getSaldo({
        where: {
          id: saldoId,
        },
        ...this._selectOptions,
      });
      return saldo;
    } catch (err) {
      console.log(err);
      return false;
    }
  }

  async create({ value, user_id }) {
    const { User, Saldo } = this._models;
    try {
      const user = await User.findByPk(user_id);
      const createNewSaldo = await user.createSaldo({
        value,
        user_id,
      });
      const newSaldo = await Saldo.findByPk(createNewSaldo.id, this._selectOptions);
      return newSaldo;
    } catch (err) {
      console.log(err);
      return false;
    }
  }

  async update({ value, saldoId, user_id }) {
    const { Saldo } = this._models;
    try {
      await Saldo.update(
        {
          value,
        },
        {
          where: {
            user_id,
            id: saldoId,
          },
        }
      );
      const updatedSaldo = await Saldo.findByPk(saldoId, this._selectOptions);
      return updatedSaldo;
    } catch (err) {
      console.log(err);
      return false;
    }
  }

  async delete({ saldoId, user_id }) {
    const { Saldo } = this._models;

    try {
      const saldoDeleteStatus = await Saldo.destroy({
        where: {
          user_id,
          id: saldoId,
        },
      });
      return { status: saldoDeleteStatus };
    } catch (err) {
      console.log(err);
      return false;
    }
  }
}

module.exports = saldoService;
