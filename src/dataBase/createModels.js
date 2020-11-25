const { user, income, cost, saving, spending, saldo, refreshToken } = require("./models");

module.exports.createModels = (sequelize) => {
  const DataTypes = sequelize.Sequelize.DataTypes;

  const User = user.createModel(sequelize, DataTypes);
  const Income = income.createModel(sequelize, DataTypes);
  const Cost = cost.createModel(sequelize, DataTypes);
  const Saving = saving.createModel(sequelize, DataTypes);
  const Spending = spending.createModel(sequelize, DataTypes);
  const Saldo = saldo.createModel(sequelize, DataTypes);
  const RefreshToken = refreshToken.createModel(sequelize, DataTypes);

  user.createAssociations({ User, Income, Cost, Saving, Spending, Saldo, RefreshToken });
  income.createAssociations({ User, Income });
  cost.createAssociations({ User, Cost });
  saving.createAssociations({ User, Saving });
  spending.createAssociations({ User, Spending });
  saldo.createAssociations({ User, Saldo });
  refreshToken.createAssociations({ RefreshToken, User });

  return {
    User,
    Income,
    Cost,
    Saving,
    Spending,
    Saldo,
    RefreshToken,
  };
};
