const Sequelize = require(`sequelize`);
const config = require("../config");
const { createModels } = require("./createModels");
const { ExitCode } = require("../utlis/constants");

const sequelize = new Sequelize(config.db.name, config.db.user_name, config.db.user_password, {
  host: config.db.host,
  dialect: config.db.dialect,
  logging: false,
});

const initDb = async () => {
  try {
    await sequelize.sync();
    console.info(`Структура БД успешно создана.`);
  } catch (err) {
    console.error(`Не удалось создать таблицы в БД ${err}`);
    process.exit(ExitCode.error);
  }

  await sequelize.close();
};

const models = createModels(sequelize);

module.exports = {
  sequelize,
  initDb,
  models,
};
