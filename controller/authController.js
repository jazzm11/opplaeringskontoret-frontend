const postApi = require("../utils/postApi");
const ONE_DAY_MS = 24 * 60 * 60 * 1000;

const setAuthCookie = (res, token) => {
  res.cookie("token", token, {
    httpOnly: true,
    secure: false,
    maxAge: ONE_DAY_MS,
  });
};

// GET
const showLoginUser = (req, res) => {
  console.log("[SUCCESS][FRONTEND][PAGE] Rendered login-user");
  res.render("login-user");
};

const showLoginStudent = (req, res) => {
  console.log("[SUCCESS][FRONTEND][PAGE] Rendered login-student");
  res.render("login-student");
};

const showRegister = (req, res) => {
  console.log("[SUCCESS][FRONTEND][PAGE] Rendered register");
  res.render("register");
};

// POST
const register = async (req, res, next) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    const response = await postApi("/users/register", {
      name,
      email,
      password,
      confirmPassword,
    });

    if (response.error) {
      return res.render("register", {
        error: response.error,
        name,
        email,
      });
    }

    console.log(`[SUCCESS][FRONTEND][AUTH] Register success: ${email}`);
    res.redirect("/login-user");
  } catch (error) {
    error.status = 500;
    error.message = "En uventet feil oppstod. Prøv igjen.";
    return next(error);
  }
};

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const response = await postApi("/users/login", {
      email,
      password,
    });

    if (response.error) {
      return res.render("login-user", {
        error: response.error,
        email,
      });
    }

    if (!response.token) {
      return res.render("login-user", {
        error: "Ingen token ble returnert fra backend",
        email,
      });
    }

    setAuthCookie(res, response.token);
    console.log(`[SUCCESS][FRONTEND][AUTH] Admin login success: ${email}`);
    res.redirect("/");
  } catch (error) {
    error.status = 500;
    error.message = "En uventet feil oppstod. Prøv igjen.";
    return next(error);
  }
};

const loginStudent = async (req, res, next) => {
  try {
    const { email, password, confirmPassword } = req.body;

    const payload = { email, password };
    if (confirmPassword) {
      payload.confirmPassword = confirmPassword;
    }

    const response = await postApi("/elev/login", payload);

    if (response.error) {
      return res.render("login-student", {
        error: response.error,
        email,
      });
    }

    if (!response.token) {
      return res.render("login-student", {
        error: "Ingen token ble returnert fra backend",
        email,
      });
    }

    setAuthCookie(res, response.token);
    console.log(`[SUCCESS][FRONTEND][AUTH] Student login success: ${email}`);

    res.redirect("/student/dashboard");
  } catch (error) {
    error.status = 500;
    error.message = "En uventet feil oppstod. Prøv igjen.";
    return next(error);
  }
};

const loginBedrift = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const response = await postApi("/bedrift/login", {
      email,
      password,
    });

    if (response.error) {
      return res.render("login-user", {
        error: response.error,
        email,
      });
    }

    if (!response.token) {
      return res.render("login-user", {
        error: "Ingen token ble returnert fra backend",
        email,
      });
    }

    setAuthCookie(res, response.token);
    console.log(`[SUCCESS][FRONTEND][AUTH] Bedrift login success: ${email}`);

    res.redirect("/bedrift/dashboard");
  } catch (error) {
    error.status = 500;
    error.message = "En uventet feil oppstod. Prøv igjen.";
    return next(error);
  }
};

const logout = (req, res) => {
  res.clearCookie("token");
  console.log("[SUCCESS][FRONTEND][AUTH] Logout success");
  res.redirect("/login-user");
};

module.exports = {
  loginBedrift,
  showLoginUser,
  showLoginStudent,
  showRegister,
  loginUser,
  register,
  loginStudent,
  logout,
};
