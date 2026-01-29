const Quote = require("../models/Quote.schema");
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const ApiFeatures = require("../utils/apiFeatures");

/*
 * @desc  get quote for gest
 * @router  /api/quote/gest
 * @method  GET
 * @access  Privet  headOffice and admin
 */
const getAllQuote =   asyncHandler(async (req, res) => {
  const documentsCounts = await Quote.countDocuments();
  const apiFeatures = new ApiFeatures(Quote.find(), req.query)
    .paginate(documentsCounts)
    .filter()
    .search()
    .limitFields()
    .sort();

  // Execute query
  const { mongooseQuery, paginationResult } = apiFeatures;
  const documents = await mongooseQuery;
  
  res
    .status(200)
    .json({ results: documents.length, paginationResult, data: documents });
});

/*
 * @desc  create a new quote
 * @router  /api/quote/gest
 * @method  POST
 * @access  public
 */

const createRequestForGest = asyncHandler(async (req, res) => {
  const {
    name,
    email,
    phoneNumber,
    tripType,
    width,
    lenght,
    weight,
    additionalDetails
  } = req.body;



  // Create the new request with default tracking data
  const createRequest = await Quote.create({
    name,
    email,
    phoneNumber,
    tripType,
    width,
    lenght,
    weight,
    additionalDetails
  });

  // Respond with success
  res.status(201).json({
    status: "success",
    data: createRequest,
  });
});


/*
 * @desc  get quote by id
 * @router  /api/quote/:id
 * @method  GET
 * @access  Privet (Admin , headOfficer)
 */

const getQuoteById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  // Fetch the quote and populate the owner information
  const quote = await Quote.findById(id)
  if (!quote) {
    return next(new ApiError(`No Quote for this id: ${id}`, 404));
  }

  // Respond with the quote data
  res.status(200).json({
    status: "success",
    data: quote,
  });
});


/*
 * @desc  update quote
 * @router  /api/quote/:id
 * @method  put
 * @access  admin and headOffice
 */

const updateQuote = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const document = await Quote.findById(id);
  if (!document) {
    return next(new ApiError(`No Quote for this id: ${id}`, 404));
  }
  if (
    req.user.accountType === "admin" ||
    req.user.accountType === "headOffice"
  ) {
    const update = await Quote.findByIdAndUpdate(
      { _id: req.params.id },
      req.body,
      { new: true }
    );
    return res.status(200).json({ status: "success", data: update });
  } else {
    return next("access denied, you are not allowed", 403);
  }
});

/*
 * @desc  delete quote
 * @router  /api/quote/:id
 * @method  delete
 * @access  admin and headOffice
 */
const deleteQuote = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const quote = await Quote.findById(id);

  if (!quote) {
    return next(new ApiError(`No Quote for this id: ${id}`, 404));
  }
  await Quote.deleteOne({ _id: id });
  return res.status(200).json({ status: "success" });
});

/*
 * @desc  create request finished
 * @router  api/quote/finished/:id
 * @method  patch
 * @access  Privet  headOffice and admin
 */
const finishQuote = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId; // Get the user ID from the token payload

    // Find the quote by ID
    const quote = await Quote.findById(id);
    if (!quote) {
      return res.status(404).json({ message: "Quote not found" });
    }

    // Check if the order is already finished
    const isAlreadyFinished = quote.status.some((status) => status.isFinished);
    if (isAlreadyFinished) {
      return res
        .status(400)
        .json({ message: "request is already marked as finished" });
    }

    // Update the status to mark the order as finished
    quote.status.push({
      isFinished: true,
      finishedAt: new Date(),
      actionBy: userId,
    });

    // Save the updated quote
    await quote.save();

    res.status(200).json({ message: "Order marked as finished", quote });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = {
finishQuote,
deleteQuote,
updateQuote,
getQuoteById,
getAllQuote,
createRequestForGest
};
