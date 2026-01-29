const User = require("../models/User.schema");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const ApiFeatures = require("../utils/apiFeatures");
const ApiError = require("../utils/apiError");


const getAllHeadOffices = asyncHandler(async (req, res) => {
const documentsCounts = await User.countDocuments();
  const apiFeatures = new ApiFeatures(User.find(), req.query)
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
 * @desc  add client and headOffice
 * @router  /api/users/createAccount
 * @method  POST
 * @access  Privet (admin)
 */

const addAccount = asyncHandler(async (req, res) => {
  const {
    name,
    username,
    email,
    password,
    phoneNumber,
  } = req.body;


  const createUser = await User.create({
    name: name,
    username: username,
    email: email,
    password: password,
    phoneNumber: phoneNumber,
  });

  // Respond with success
  res.status(201).json({
    status: "success",
    data: { createUser },
  });
});

/*
 * @desc  get headOfficer by id
 * @router  /api/headOfficer/:id
 * @method  GET
 * @access  Privet (admin only)
 */

const getHeadOffice = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const document = await User.findOne({ _id: id, accountType: "headOffice" });

  if (!document) {
    return next(new ApiError(`No user found for this id: ${id}`, 404));
  }

  res.status(200).json({ status: "success", data: document });
});


/*
 * @desc  delete user
 * @router  /api/users/:id
 * @method  DELETE
 * @access  Privet
 */

const deleteHeadOffice = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const user = await User.findById(id);

  const document = await User.findOne({ _id: id, accountType: "headOffice" });

  if (!document) {
    return next(new ApiError(`No user found for this id: ${id}`, 404));
  }

  if (req.user.accountType === "admin") {
    await User.deleteOne({ _id: id});
    //delete request
    return res.status(200).json({ status: "success" });
  } else {
    return next(new ApiError(`access denied, you are not allowed`, 403));
  }
});

module.exports = {
getAllHeadOffices,
addAccount,
getHeadOffice,
deleteHeadOffice
};
