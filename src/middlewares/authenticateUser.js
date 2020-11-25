const { HttpCode } = require(`../utlis/constants`);

module.exports = (service) => async (req, res, next) => {
  const { email, password } = req.body;
  const user = await service.checkAuthData({ email, password });

  if (!user) {
    res.status(HttpCode.FORBIDDEN).json("User doesn't exist");
  }
  console.log(user);
  res.locals.user = user.dataValues;
  next();
};
