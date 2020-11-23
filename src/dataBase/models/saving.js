const moment = require("moment");

const createModel = (sequelize, DataTypes) => {
  class Saving extends sequelize.Sequelize.Model {}
  Saving.init(
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
          return moment.utc(this.getDataValue("date")).format("YYYY-MM");
        },
      },
    },
    {
      sequelize,
      timestamps: false,
      paranoid: false,
      modelName: `saving`,
    }
  );

  return Saving;
};
const createAssociations = ({ User, Saving }) => {
  Saving.belongsTo(User, {
    foreignKey: `user_id`,
  });
};

module.exports = {
  createModel,
  createAssociations,
};
