const { HttpCode } = require("../utlis/constants");

module.exports = (service) => async (req, res, next) => {
  try {
    const { email } = req.body;
    const storedRefreshToken = await service.findByUser({ email });
    if (storedRefreshToken) {
      console.log("token found");
      return res.status(HttpCode.OK).end();
    }
  } catch (err) {
    console.error(`Error: ${err.message}.`);
    next(err);
  }

  console.log("token not found");
  next();
};
