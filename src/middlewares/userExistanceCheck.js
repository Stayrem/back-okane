const { HttpCode } = require("../utlis/constants");

module.exports = ({ service }) => async (req, res, next) => {
  const { email } = req.body;

  try {
    const existance = await service.checkExistance(email);

    if (existance) {
      return res.status(HttpCode.CONFLICT);
    }
  } catch (err) {
    console.error(`Error: ${err.message}.`);
    next(err);
  }

  next();
};
