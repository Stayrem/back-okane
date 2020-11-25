const bcrypt = require("bcrypt");
const { SaltRounds } = require("./constants");

const createHash = async (password) => {
  return await bcrypt.hash(password, SaltRounds);
};

module.exports = {
  createHash,
};
