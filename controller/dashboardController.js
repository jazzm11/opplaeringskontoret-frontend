const getApi = require("../utils/getApi");

const showDashboard = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    const response = await getApi("/bedrift/mine", token);

    console.log("[SUCCESS][FRONTEND][PAGE] Rendered admin dashboard");
    return res.render("index", {
      bedrifter: response.bedrifter || [],
    });
  } catch (error) {
    error.status = 500;
    error.message = "Kunne ikke laste bedriftene dine.";
    return next(error);
  }
};

// Show student dashboard
const showStudentDashboard = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    const response = await getApi("/elev/me", token);
    console.log("[SUCCESS][FRONTEND][PAGE] Rendered student dashboard");
    return res.render("student-dashboard", {
      elev: response.elev || null,
    });
  } catch (error) {
    error.status = 500;
    error.message = "Kunne ikke laste vurderinger.";
    return next(error);
  }
};

module.exports = {
  showDashboard,
  showStudentDashboard,
};