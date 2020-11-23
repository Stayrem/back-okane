const moment = require("moment");

const createModel = (sequelize, DataTypes) => {
  class Spending extends sequelize.Sequelize.Model {}
  Spending.init(
    {
      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
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
      modelName: `spending`,
    }
  );

  return Spending;
};
const createAssociations = ({ User, Spending }) => {
  Spending.belongsTo(User, {
    foreignKey: `user_id`,
  });
};

module.exports = {
  createModel,
  createAssociations,
};
