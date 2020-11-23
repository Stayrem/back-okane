const moment = require("moment");

const createModel = (sequelize, DataTypes) => {
  class Saldo extends sequelize.Sequelize.Model {}
  Saldo.init(
    {
      value: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      date: {
        field: `date`,
        type: DataTypes.DATEONLY,
        defaultValue: sequelize.Sequelize.NOW,
        get: function () {
          return moment.utc(this.getDataValue("date")).format("YYYY-MM-DD");
        },
      },
    },
    {
      sequelize,
      timestamps: false,
      paranoid: false,
      modelName: `saldo`,
    }
  );

  return Saldo;
};
const createAssociations = ({ User, Saldo }) => {
  Saldo.belongsTo(User, {
    foreignKey: `user_id`,
  });
};

module.exports = {
  createModel,
  createAssociations,
};
