const express = require("express");
const router = express.Router();
const chalk = require("chalk");
const hashService = require("../../utils/hash/hashService");
const {
  registerUserValidation,
  loginUserValidation,
} = require("../../validation/authValidationService");
const normalizeUser = require("../../model/usersService/helpers/normalizationUserService");
const usersServiceModel = require("../../model/usersService/usersService");
const { generateToken } = require("../../utils/token/tokenService");
const CustomError = require("../../utils/CustomError");
const authmw = require("../../middleware/authMiddleware");
const {
  userEditValidation,
} = require("../../validation/joi/editUserValidation");
const permissionsMiddleware = require("../../middleware/permissionsMiddleware");
const failedLoginStoreService = require("../../model/mongodb/failedLoginStore/FailedLoginStoreService");
const failedLoginHelper = require("../../model/failedLoginStoreService/helpers/failedLoginStoreNormalizations");

// http://localhost:8181/api/users/users
router.post("/register", async (req, res) => {
  try {
    await registerUserValidation(req.body);
    req.body.password = await hashService.generateHash(req.body.password);
    req.body = await normalizeUser(req.body);
    let user = await usersServiceModel.registerUser(req.body);
    if (!user.password) {
      throw new CustomError("something went wrong, check the database");
    }
    let newUser = JSON.parse(JSON.stringify(user));
    delete newUser.password;
    res.json(newUser);
  } catch (err) {
    console.log(chalk.red("Registration Error:"));
    if (err.name && err.name.includes("Mongo") && err.code === 11000) {
      res.status(400).json({
        msg: "The email address is already being used. please choose another email address",
      });
    } else {
      console.error(err);
      res.status(400).json(err);
    }
  }
});

router.post("/login", async (req, res) => {
  try {
    await loginUserValidation(req.body);
    let { email } = req.body;
    const userData = await usersServiceModel.getUserByEmail(email);
    if (!userData) throw new CustomError("invalid email and/or password");
    let blockedUser = await failedLoginStoreService.getBlockedUserByEmail(
      email
    );
    if (blockedUser) {
      await failedLoginHelper.handleBlockTime(blockedUser);
    }
    const isPasswordMatch = await hashService.cmpHash(
      req.body.password,
      userData.password
    );
    if (!isPasswordMatch) {
      let attempts = blockedUser ? blockedUser.attempts : 0;
      let normalizedLoginFailure =
        failedLoginHelper.normalizeLoginFailure(email);
      !blockedUser &&
        (await failedLoginStoreService.addNewUserToStore(
          normalizedLoginFailure
        ));
      attempts++;
      if (attempts >= 3) {
        attempts == 3 &&
          (await failedLoginStoreService.incrementAttemptsOfUser(email));
        throw new CustomError(
          "Too many failed login attempts. Account blocked."
        );
      } else {
        await failedLoginStoreService.incrementAttemptsOfUser(email);
      }
      throw new CustomError("Invalid email or password");
    }
    await failedLoginStoreService.removeBlockedUserFromStore(email);
    const token = await generateToken({
      _id: userData._id,
      isAdmin: userData.isAdmin,
    });
    res.json({ token });
  } catch (err) {
    res.status(400).json(err);
  }
});

// http://localhost:8181/api/users/users
router.get(
  "/users",
  authmw,
  permissionsMiddleware(true, false),
  async (req, res) => {
    try {
      const users = await usersServiceModel.getAllUsers();
      let newUsers = JSON.parse(JSON.stringify(users));
      for (const user of newUsers) {
        if (user.image && user.image.imageFile && user.image.imageFile.data) {
          let tempImage = JSON.parse(JSON.stringify(user.image.imageFile.data));
          const bufferData = Buffer.from(tempImage.data);
          // Convert the Buffer object to a Base64-encoded string
          const base64Data = bufferData.toString("base64");

          user.image.dataStr = base64Data + "";
        }
      }
      res.json(newUsers);
    } catch (err) {
      console.log(chalk.red("Failed to retrieve users:"));
      console.error(err);
      res.status(500).json({ error: "Failed to retrieve users" });
    }
  }
);

router.get(
  "/user/:id",
  authmw,
  permissionsMiddleware(true, true),
  async (req, res) => {
    try {
      const userFromDB = await usersServiceModel.getUserById(req.params.id);
      if (!userFromDB) {
        throw new CustomError("something went wrong, try again later");
      }
      let newUserFromDB = JSON.parse(JSON.stringify(userFromDB));
      if (
        newUserFromDB.image &&
        newUserFromDB.image.imageFile &&
        newUserFromDB.image.imageFile.data
      ) {
        let tempImage = JSON.parse(
          JSON.stringify(newUserFromDB.image.imageFile.data)
        );
        const bufferData = Buffer.from(tempImage.data);
        // Convert the Buffer object to a Base64-encoded string
        const base64Data = bufferData.toString("base64");

        newUserFromDB.image.dataStr = base64Data + "";
      }
      res.json(newUserFromDB);
    } catch (err) {
      res.status(400).json(err);
    }
  }
);

router.get("/userInfo", authmw, async (req, res) => {
  try {
    if (!req.userData) {
      throw new CustomError("something went wrong, try again later");
    }
    let userFromDB = await usersServiceModel.getUserById(req.userData._id);
    if (!userFromDB) {
      throw new CustomError("something went wrong, try again later");
    }
    let newUserFromDB = JSON.parse(JSON.stringify(userFromDB));

    if (
      newUserFromDB.image &&
      newUserFromDB.image.imageFile &&
      newUserFromDB.image.imageFile.data
    ) {
      let tempImage = JSON.parse(
        JSON.stringify(newUserFromDB.image.imageFile.data)
      );
      const bufferData = Buffer.from(tempImage.data);
      // Convert the Buffer object to a Base64-encoded string
      const base64Data = bufferData.toString("base64");

      newUserFromDB.image.dataStr = base64Data + "";
    } else {
      newUserFromDB = await normalizeUser(newUserFromDB);
    }
    res.status(200).json(newUserFromDB);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.put(
  "/edituser/:id",
  authmw,
  permissionsMiddleware(false, true),
  async (req, res, next) => {
    if (req.userData._id == req.params.id) {
      next();
    } else {
      return res.status(403).json({ msg: "You Cant Do That" });
    }
  },
  async (req, res) => {
    try {
      await userEditValidation(req.body);
      let normalizedUser = await normalizeUser(req.body);
      const userFromDB = await usersServiceModel.updateUser(
        req.params.id,
        normalizedUser
      );
      res.json(userFromDB);
    } catch (err) {
      console.log(chalk.red("Registration Error:"));
      if (err.name && err.name.includes("Mongo") && err.code === 11000) {
        res.status(400).json({
          msg: "The email address is already being used. please choose another email address",
        });
      } else {
        console.error(err);
        res.status(400).json(err);
      }
    }
  }
);

router.patch(
  "/users/:id",
  authmw,
  permissionsMiddleware(true, false),
  async (req, res) => {
    try {
      let updatedUser = await usersServiceModel.updateAdminUser(req.params.id);
      let newUserFromDB = JSON.parse(JSON.stringify(updatedUser));
      if (
        newUserFromDB.image &&
        newUserFromDB.image.imageFile &&
        newUserFromDB.image.imageFile.data
      ) {
        let tempImage = JSON.parse(
          JSON.stringify(newUserFromDB.image.imageFile.data)
        );
        const bufferData = Buffer.from(tempImage.data);
        // Convert the Buffer object to a Base64-encoded string
        const base64Data = bufferData.toString("base64");

        newUserFromDB.image.dataStr = base64Data + "";
      }
      res.status(200).json(newUserFromDB);
    } catch (err) {
      console.log(chalk.red("Update user status failed"));
      console.error(err);
      res.status(400).json(err);
    }
  }
);

router.delete(
  "/user/:id",
  authmw,
  permissionsMiddleware(true, true),
  async (req, res) => {
    try {
      const userId = req.params.id;
      const user = await usersServiceModel.getUserById(userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      await usersServiceModel.deleteUser(userId);
      res.json({ message: "User deleted successfully" });
    } catch (err) {
      console.log(chalk.red("User Deletion Error:"));
      console.error(err);
      res.status(500).json({ error: "Failed to delete user" });
    }
  }
);

module.exports = router;
