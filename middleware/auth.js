const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) return res.redirect("/login-user");
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    res.locals.user = req.user;
    next();
  } catch (error) {
    res.clearCookie("token");
    return res.redirect("/login-user");
  }
};

module.exports = auth;
