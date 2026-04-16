const getApi = require("../utils/getApi");

// Show dashboard for a logged-in bedrift (role: "bedrift")
const showBedriftDashboard = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    const user = req.user; // set by frontend auth middleware

    if (!user || user.role !== "bedrift") {
      return res.redirect("/login-user");
    }

    const bedriftId = user.id;

    const response = await getApi(`/bedrift/${bedriftId}/elever`, token);
    const elever = response.elever || [];
    const bedrift = response.bedrift || null;

    console.log(`[SUCCESS][FRONTEND][PAGE] Rendered bedrift-dashboard for bedriftId: ${bedriftId}`);
    return res.render("bedrift-dashboard", { bedrift, elever });
  } catch (error) {
    error.status = 500;
    error.message = "Kunne ikke laste bedriftoversikten";
    return next(error);
  }
};

module.exports = {
  showBedriftDashboard,
};