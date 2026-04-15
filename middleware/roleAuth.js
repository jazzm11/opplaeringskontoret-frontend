const studentOnly = (req, res, next) => {
  if (!req.user || req.user.role !== "elev") {
    return res.redirect("/");
  }
  return next();
};

const adminOnly = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.redirect("/student/dashboard");
  }
  return next();
};

module.exports = {
  studentOnly,
  adminOnly,
};
