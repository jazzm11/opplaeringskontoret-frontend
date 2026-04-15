const getApi = require("../utils/getApi");

const showDashboard = async (req, res) => {
  try {
    const token = req.cookies.token;
    const response = await getApi("/bedrift/mine", token);

    return res.render("index", {
      bedrifter: response.bedrifter || [],
    });
  } catch (error) {
    console.log(error);
    return res.render("index", {
      bedrifter: [],
      error: "Could not load your bedrifter.",
    });
  }
};

// Show student dashboard
const showStudentDashboard = async (req, res) => {
  try {
    const token = req.cookies.token;
    const response = await getApi("/elev/me", token);
    return res.render("student-dashboard", {
      elev: response.elev || null,
    });
  } catch (error) {
    console.log(error);
    return res.render("student-dashboard", {
      elev: null,
      error: "Could not load vurderinger.",
    });
  }
};

module.exports = {
  showDashboard,
  showStudentDashboard,
};