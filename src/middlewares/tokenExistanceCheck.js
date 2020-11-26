const { HttpCode } = require("../utlis/constants");

module.exports = (service) => async (req, res, next) => {
  try {
    const { email } = req.body;
    const storedRefreshToken = await service.findByUser({ email });
    if (storedRefreshToken) {
      return res.status(HttpCode.OK).end();
    }
  } catch (err) {
    console.error(`Error: ${err.message}.`);
    next(err);
  }
  next();
};
