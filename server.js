// Dependencies
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");

// App Settings
const app = express();
require("dotenv").config();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");
app.use(cookieParser());
 
// Route Imports
const dashboardRouter = require("./router/dashboardRouter");
const authRouter = require("./router/authRouter");
const bedriftRouter = require("./router/bedriftRouter");

// Routes
app.use(dashboardRouter);
app.use(authRouter);
app.use(bedriftRouter);

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
