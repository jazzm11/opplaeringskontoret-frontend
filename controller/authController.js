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
  res.render("login-user");
};

const showLoginStudent = (req, res) => {
  res.render("login-student");
};

const showRegister = (req, res) => {
  res.render("register");
};

// POST
const register = async (req, res) => {
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

    res.redirect("/login-user");
  } catch (error) {
    res.render("register", {
      error: "Unexpected error occurred. Please try again.",
    });
    console.log(error);
  }
};

const loginUser = async (req, res) => {
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
        error: "No token returned from backend",
        email,
      });
    }

    setAuthCookie(res, response.token);
    res.redirect("/");
  } catch (error) {
    res.render("login-user", {
      error: "Unexpected error occurred. Please try again.",
    });
    console.log(error);
  }
};

const loginStudent = async (req, res) => {
  try {
    const { email, password, confirmPassword } = req.body;

    const response = await postApi("/elev/login", {
      email,
      password,
      confirmPassword,
    });

    if (response.error) {
      return res.render("login-student", {
        error: response.error,
        email,
      });
    }

    if (!response.token) {
      return res.render("login-student", {
        error: "No token returned from backend",
        email,
      });
    }

    setAuthCookie(res, response.token);

    res.redirect("/student/dashboard");
  } catch (error) {
    console.log(error);
    res.render("login-student", {
      error: "Unexpected error occurred. Please try again.",
    });
  }
};

const logout = (req, res) => {
  res.clearCookie("token");
  res.redirect("/login-user");
};


module.exports = {
  showLoginUser,
  showLoginStudent,
  showRegister,
  loginUser,
  register,
  loginStudent,
  logout,
};
