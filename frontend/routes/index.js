import express from "express";
import axios from "axios";

const router = express.Router();
const BACKEND_URL = process.env.BACKEND_URL;

// Middleware to check login
function isAuthenticated(req, res, next) {
  if (req.cookies.access_token) return next();
  res.redirect("/login");
}

// Home
router.get("/", (req, res) => {
  const user = req.cookies.user ? JSON.parse(req.cookies.user) : null;
  res.render("index", { user });
});

// Register
router.get("/register", (req, res) => {
  res.render("register", { error: null });
});

router.post("/register", async (req, res) => {
  try {
    await axios.post(`${BACKEND_URL}/auth/register`, req.body);
    res.redirect("/login");
  } catch (error) {
    res.render("register", { error: "Registration failed" });
  }
});

// Login
router.get("/login", (req, res) => {
  res.render("login", { error: null });
});

router.post("/login", async (req, res) => {
  try {
    const response = await axios.post(`${BACKEND_URL}/auth/login`, req.body, {
      withCredentials: true,
    });

    // Extract token from set-cookie (if needed) or response
    const token = response.headers['set-cookie']
      ?.find(cookie => cookie.startsWith('access_token'))
      ?.split(';')[0]
      ?.split('=')[1];

    if (token) {
      res.cookie("access_token", token, { httpOnly: true });
      res.cookie("user", JSON.stringify(response.data.details));
    }

    res.redirect("/dashboard");
  } catch (error) {
    res.render("login", { error: "Login failed" });
  }
});

// Dashboard (protected)
router.get("/dashboard", isAuthenticated, (req, res) => {
  const user = JSON.parse(req.cookies.user || "{}");
  res.render("dashboard", { user });
});

// Logout
router.get("/logout", (req, res) => {
  res.clearCookie("access_token");
  res.clearCookie("user");
  res.redirect("/");
});

export default router;
