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
        defaultValue: sequelize.Sequelize.literal("CURRENT_TIMESTAMP"),
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
