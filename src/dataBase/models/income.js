const createModel = (sequelize, DataTypes) => {
  class Income extends sequelize.Sequelize.Model {}
  Income.init(
    {
      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      status: {
        type: sequelize.Sequelize.ENUM,
        values: [`active`, `inActive`],
        allowNull: false,
      },
      value: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      date: {
        field: `date`,
        type: DataTypes.DATEONLY,
        defaultValue: sequelize.Sequelize.NOW,
      },
    },
    {
      sequelize,
      timestamps: false,
      paranoid: false,
      modelName: `income`,
    }
  );

  return Income;
};
const createAssociations = ({ User, Income }) => {
  Income.belongsTo(User, {
    foreignKey: `user_id`,
  });
};

module.exports = {
  createModel,
  createAssociations,
};
