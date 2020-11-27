const Sequelize = require(`sequelize`);
const config = require("../config");
const { createModels } = require("./createModels");
const { ExitCode } = require("../utlis/constants");

const sequelize = new Sequelize(config.db.name, config.db.user_name, config.db.user_password, {
  host: config.db.host,
  dialect: config.db.dialect,
  logging: false,
});

const models = createModels(sequelize);

const initDb = async () => {
  try {
    console.info(`Trying to connect to the database`);
    const connection = await sequelize.sync();
    console.info(`Successfully connected to the ${connection.config.database} database`);
  } catch (err) {
    console.error(`Can't connect to database.Error: ${err}`);
    process.exit(ExitCode.error);
  }

  /*   await sequelize.close(); */
};

module.exports = {
  sequelize,
  initDb,
  models,
};
