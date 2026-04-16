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
app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    const durationMs = Date.now() - start;
    console.log(`[FRONTEND] ${req.method} ${req.originalUrl} ${res.statusCode} - ${durationMs}ms`);
  });
  next();
});
 
// Route Imports
const dashboardRouter = require("./router/dashboardRouter");
const authRouter = require("./router/authRouter");
const bedriftRouter = require("./router/bedriftRouter");
const faqRouter = require("./router/faqRouter");
const bedriftDashboardRouter = require("./router/bedriftDashboardRouter");

// Routes
app.use(dashboardRouter);
app.use(faqRouter);
app.use(authRouter);
app.use(bedriftRouter);
app.use(bedriftDashboardRouter);

app.use((req, res) => {
  return res.status(404).render("error", { error: "Siden finnes ikke." });
});

app.use((error, req, res, next) => {
  const status = error.status || 500;
  const message = error.message || "En uventet feil oppstod.";

  console.error("[FRONTEND ERROR]", {
    method: req.method,
    url: req.originalUrl,
    status,
    message,
  });

  return res.status(status).render("error", { error: message });
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
