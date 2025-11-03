const authService = require("../services/auth.service");
const logger = require("../config/logger");

async function register(req, res, next) {
  try {
    const { name, email, password } = req.body;
    const { user, token } = await authService.register({
      name,
      email,
      password,
    });
    res.status(201).json({
      token,
      user: { id: user.id, email: user.email, name: user.name },
    });
  } catch (err) {
    logger.error(err);
    next(err);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    console.log(JSON.stringify(req.body));
    const { user, token } = await authService.login({ email, password });
    res.json({
      token,
      user: { id: user.id, email: user.email, name: user.name },
    });
  } catch (err) {
    logger.error(err);
    next(err);
  }
}

module.exports = { register, login };
