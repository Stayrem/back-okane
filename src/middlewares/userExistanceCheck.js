const { HttpCode } = require("../utlis/constants");

module.exports = (service) => async (req, res, next) => {
  const { email } = req.body;
  try {
    const user = await service.checkExistance(email);

    if (user) {
      return res.status(HttpCode.CONFLICT).end();
    }
  } catch (err) {
    console.error(err);
    next(err);
  }

  next();
};
