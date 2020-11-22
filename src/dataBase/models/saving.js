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
        defaultValue: sequelize.Sequelize.literal("CURRENT_TIMESTAMP"),
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
