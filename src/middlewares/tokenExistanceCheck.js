const { HttpCode } = require("../utlis/constants");

module.exports = (service) => async (req, res, next) => {
  const { email } = req.body;

  try {
    const storedRefreshToken = await service.findByUser({ email });
    if (storedRefreshToken) {
      return res.status(HttpCode.OK).end();
    }
  } catch (err) {
    console.error(err);
    next(err);
  }
  next();
};
