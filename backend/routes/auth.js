const express = require("express");
const router = express.Router();

/*
  @route GET /
  @desc  Endpoint for the frontend to check if the user is currently authenticated.
  This is useful on page refresh to rehydrate the frontend auth state.
*/
router.get("/", (req, res) => {
  if (req.isAuthenticated()) {
    // User is logged in, send back authenticated = true
    // Include req.user so frontend can populate user state
    res.status(200).json({ authenticated: true, user: req.user });
  } else {
    // User is not logged in, send back authenticated = false
    res.status(200).json({ authenticated: false });
  }
});

module.exports = router;
