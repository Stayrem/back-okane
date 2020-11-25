const moment = require("moment");

const createModel = (sequelize, DataTypes) => {
  class User extends sequelize.Sequelize.Model {}
  User.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: sequelize.Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
        unique: true,
      },
      email: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      sign_up_date: {
        field: `sign_up_date`,
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
      modelName: `user`,
    }
  );

  return User;
};
const createAssociations = ({ User, Income, Cost, Saving, Spending, Saldo }) => {
  User.hasMany(Income, {
    as: `incomes`,
    foreignKey: `user_id`,
  });
  User.hasMany(Cost, {
    as: `costs`,
    foreignKey: `user_id`,
  });
  User.hasMany(Saving, {
    as: `savings`,
    foreignKey: `user_id`,
  });
  User.hasMany(Spending, {
    as: `spendings`,
    foreignKey: `user_id`,
  });
  User.hasMany(Saldo, {
    as: `saldo`,
    foreignKey: `user_id`,
  });
};

module.exports = {
  createModel,
  createAssociations,
};
