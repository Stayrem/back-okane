const path = require("path");
const dotenv = require("dotenv").config({
  path: path.join(__dirname, "../settings.env"),
});
const { ExitCode } = ".utils/constants";

if (dotenv.error) {
  console.error(`Can't get env variables. Error: ${dotenv.error}`);
  process.exit(ExitCode.error);
}

module.exports = {
  db: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    name: process.env.DB_NAME,
    user_name: process.env.DB_USER_NAME,
    user_password: process.env.DB_USER_PASSWORD,
    dialect: process.env.DB_DIALECT,
  },
  jwt: {
    access_secret: process.env.JWT_ACCESS_SECRET,
    refresh_secret: process.env.JWT_REFRESH_SECRET,
    access_duration: process.env.JWT_ACCESS_DURATION,
    refresh_duration: process.env.JWT_REFRESH_DURATION,
  },
};
