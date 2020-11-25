const { HttpCode } = require("../utlis/constants");

module.exports = (service) => async (req, res, next) => {
  const { email } = req.body;
  try {
    const user = await service.checkExistance(email);

    if (user) {
      return res.status(HttpCode.CONFLICT).send("user already exists");
    }
  } catch (err) {
    console.error(`Error: ${err.message}.`);
    next(err);
  }

  next();
};
