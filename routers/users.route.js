const express = require("express");
const router = express.Router();
const authController = require("../controllers/user.controller");
const middlewareValidator = require("../middlewares/validators/users.validation");
const { verifyToken } = require("../middlewares/verifyToken");
const type = require("../middlewares/verifyToken");



router.get(
  "/headOffice",
  verifyToken,
  type.adminOnly,
  authController.getAllHeadOffices
);

router.post(
  "/addAccount",

  middlewareValidator.postValidateUser,
  authController.addAccount,
);


router.get(
  "/headOffice/:id",
  verifyToken,
  middlewareValidator.validateUserId,
  type.adminOnly,
  authController.getHeadOffice
);



  router.delete(
    "/headOffice/:id",
    verifyToken,
    type.adminOnly,
    middlewareValidator.deleteValidateUserId,
    authController.deleteHeadOffice
  );

module.exports = router;
