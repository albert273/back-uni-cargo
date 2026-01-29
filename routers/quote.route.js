const express = require("express");
const router = express.Router();
const quoteController = require("../controllers/quote.controller");
const middlewareValidator = require("../middlewares/validators/quote.vallidators");
const { verifyToken } = require("../middlewares/verifyToken");
const type = require("../middlewares/verifyToken");

router.get(
  "/:id",
  verifyToken,
  middlewareValidator.validateQuoteId,
  quoteController.getQuoteById
);

router.get(
  "/",
  verifyToken,
  type.AdminAndHeadOffice,
  quoteController.getAllQuote
);


router.post(
  "/guest",
  middlewareValidator.postValidateQuoteForGest,
  quoteController.createRequestForGest
);


router.put(
  "/:id",
  verifyToken,
  type.AdminAndHeadOffice,
  middlewareValidator.validateQuoteId,
  quoteController.updateQuote
);

router.delete(
  "/:id",
  verifyToken,
  type.AdminAndHeadOffice,
  middlewareValidator.validateQuoteId,
  quoteController.deleteQuote
);



router.patch(
  "/finished/:id",
  verifyToken,
  middlewareValidator.validateQuoteId,
  type.AdminAndHeadOffice,
  quoteController.finishQuote
);

module.exports = router;
