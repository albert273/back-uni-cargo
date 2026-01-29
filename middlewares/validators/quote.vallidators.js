const { check } = require("express-validator");
const validatorMiddleware = require("../validator.middleware");
const slugify = require("slugify");


const validateQuoteId = [
  check("id").isMongoId().withMessage("Invalid quote id"),
  validatorMiddleware,
];

const postValidateQuoteForGest = [
  check("name")
    .notEmpty()
    .withMessage("name is required")
    .isLength({ min: 2 })
    .withMessage("Too short User first name")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),

  check("email")
    .notEmpty()
    .withMessage("email is required")
    .isEmail()
    .withMessage("Invalid email address"),
  check("phoneNumber")
    .notEmpty()
    .withMessage("phone Number is required")
    .isLength({ min: 11 })
    .withMessage("Too short User phone Number"),

    check("width")
    .notEmpty()
    .withMessage("width is required"),

    check("lenght")
    .notEmpty()
    .withMessage("lenght is required"),

    check("weight")
    .notEmpty()
    .withMessage("weight is required"),
    
        check("tripType")
    .notEmpty()
    .withMessage("trip Type is required"),

  validatorMiddleware,
];

const updateTracking = [
  check("trackingNames")
    .notEmpty()
    .withMessage("tracking Names is required")
    .isLength({ min: 2 })
    .withMessage("Too short tracking Names first name")
]


module.exports = {
  validateQuoteId,
  postValidateQuoteForGest,
  updateTracking,
};
