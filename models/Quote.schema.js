const mongoose = require("mongoose");

const QuoteSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "name is required"],
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    slug: {
      type: String,
      lowercase: true,
    },
    email: {
      type: String,
      required: [true, "email is required"],
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    phoneNumber: {
      type: String,
      required: [true, "phone number is required"],
      trim: true,
      minlength: 8,
    },
    tripType: {
      type: String,
      trim: true,
      minlength: 2,
      maxlength: 100,
      required: [true, "trip type is required"],
    },
    width: {
      type: String,
      trim: true,
      required: [true, "width is required"],
    },
    lenght: {
      type: String,
      trim: true,
      required: [true, "lenght is required"],
    },
    weight: {
      type: String,
      trim: true,
      required: [true, "weight is required"],
    },
        additionalDetails: {
      type: String,
      minlength: 2,
      maxlength: 1000,
    },
    status: [
      {
        isFinished: {
          type: Boolean,
          default: false,
        },
        finishedAt: {
          type: Date,
          default: null,
        },
      },
    ],
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);


const Quote = mongoose.model("Quote", QuoteSchema);

module.exports = Quote;
