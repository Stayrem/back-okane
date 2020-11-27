const createModel = (sequelize, DataTypes) => {
  class RefreshToken extends sequelize.Sequelize.Model {}
  RefreshToken.init(
    {
      token: {
        type: DataTypes.STRING(1000),
        allowNull: false,
        unique: true,
      },
      /*       exp_date: {
        field: `exp_date`,
        type: DataTypes.DATE,
        defaultValue: new Date(Date.now() + 1000 * 60 * 60 * 24 * 60), // 60d
      }, */
    },
    {
      sequelize,
      timestamps: false,
      paranoid: false,
      modelName: `refreshToken`,
    }
  );

  return RefreshToken;
};
const createAssociations = ({ RefreshToken, User }) => {
  RefreshToken.belongsTo(User, { foreignKey: "user_id", as: "users" });
};

module.exports = {
  createModel,
  createAssociations,
};
