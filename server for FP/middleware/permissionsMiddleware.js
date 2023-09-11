const CustomError = require("../utils/CustomError");
const { idValidation } = require("../validation/idValidationService");

const checkOwnIdIfAdminIsOptionalForUsingSelfID = async (
  idUser,
  idParams,
  res,
  next
) => {
  try {
    await idValidation(idParams);
    if (idParams == idUser) {
      next();
    } else {
      res.send("The user is NOT verified for using other id");
    }
  } catch (err) {
    res.status(400).json(err);
  }
};

const permissionsMiddleware = (isAdmin, isAdminOptional = false) => {
  return (req, res, next) => {
    if (!req.userData) {
      throw new CustomError("Must provide user data");
    }
    if (isAdmin === req.userData.isAdmin && isAdmin === true) {
      return next();
    }
    if (isAdminOptional) {
      return checkOwnIdIfAdminIsOptionalForUsingSelfID(
        req.userData._id,
        req.params.id,
        res,
        next
      );
    }
    res.status(401).json({ msg: "Permission needed" });
  };
};

module.exports = permissionsMiddleware;

/*
  isAdmin = is admin
*/
