const express = require("express");
const router = express.Router();
const passport = require("../middleware/passport.js");
const bcrypt = require("bcrypt");
const UserModel = require("../models/userModel.js");
const validator = require('validator');
// Middleware that ensures user is logged in before accessing routes
const verifyAuthentication = require("../middleware/verifyAuthentication.js");

//Registers a new user in the database and logs the user in
/*
  @route POST /users/register
  @desc  Registers a new user and logs them in immediately
*/
router.post("/register", async (req, res, next) => {
  console.log('entro1');
  try {
    const { email, password, firstName, lastName, address } = req.body;
    if (
      email &&
      password &&
      firstName &&
      lastName &&
      address &&
      validator.isEmail(email)
    ) {
      console.log('entro2');
      // Checks if user already exists with that username (email)
      const user = await UserModel.findByEmail(email);

      if (!user) {
        // If the user doesn´t exist we hash the password
        const salt = await bcrypt.genSalt(5);
        const hash = await bcrypt.hash(password, salt);
        // Saves the user into the database
        const userData = await UserModel.registerUser(
          email,
          hash,
          firstName,
          lastName,
          address
        );

        // Log the user in right after the registration
        req.login(userData, (err) => {
          if (err) return next(err);
          res.status(201).json({
            user: {
              id: userData.id,
              email: userData.email,
              firstname: userData.firstname,
              lastname: userData.lastname,
              address: userData.address,
            },
          });
        });
      } else {
        res.status(409).json("A user with this email address already exists");
      }
    } else {
      res.status(409).json("Some field in the registration is missing or wrong");
    }
  } catch (err) {
    console.log(err);
    next(err);
  }
});

// Alternative login version using redirects. Useful when using views rather than a HTTP client
/*router.get(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/menu", //It redirects to the menu page if login succeeds
    failureRedirect: "/login", //It redirects to the login page if login fails
  })
);
*/

/*
  @route POST /users/login
  @desc  Logs in an existing user with Passport "local" strategy
*/
router.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.status(401).send("Invalid credentials");
    // Log the user into the session
    req.login(user, (err) => {
      if (err) return next(err);
      res.status(200).json({
        message: "Logged in successfully",
        user: {
          id: user.id,
          email: user.email,
          firstname: user.firstname,
          lastname: user.lastname,
          address:user.address,
        },
      });
    });
  })(req, res, next);
});

/*
  @route POST /users/logout
  @desc  Logs out the currently authenticated user
*/
router.post("/logout", verifyAuthentication, (req, res, next) => {
  // Logs the user out
  // Passport removes the req.user property and the user id is removed from the session;
  req.logout((err) => {
    if (err) return next(err);
    res.status(200).json({ message: "Logged out successfully" });
  });
});

/*
  @route GET /users/profile
  @desc  Retrieves the profile details of the authenticated user
*/
router.get("/profile", verifyAuthentication, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const results = await UserModel.viewProfile(userId);
    res.status(200).send(results);
  } catch (err) {
    next(err);
  }
});

/*
  @route POST /users/delete
  @desc  Deletes the authenticated user from the database
*/
router.delete("/delete", verifyAuthentication, async (req, res, next) => {
  try {
    const userId = req.user.id;
    await UserModel.deleteUser(userId);
    // Logs the user out
    // Passport removes the req.user property and the user id is removed from the session;
    req.logout((err) => {
      if (err) return next(err);
      res.status(200).json("The user has been deleted");
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
