const { HttpCode } = require(`../utlis/constants`);

module.exports = (service) => async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await service.checkAuthData({ email, password });

    if (!user) {
      return res.status(HttpCode.FORBIDDEN).end();
    }
  } catch (err) {
    console.log(err);
    next(err);
  }

  res.locals.user = user.dataValues;
  next();
};
