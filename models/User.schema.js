const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "name is required"],
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    username: {
      type: String,
      required: [true, "username is required"],
      trim: true,
      minlength: 2,
      maxlength: 100,
      unique: [true, "username is unique"],
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
      unique: [true, "email is unique"],
    },
    password: {
      type: String,
      required: [true, "password is required"],
      trim: true,
      minlength: 6,
    },
    phoneNumber: {
      type: String,
      required: [true, "phone number is required"],
      trim: true,
      minlength: 8,
    },
    accountType: {
      type: String,
      required: [true, "Account type is required"],
      default: "admin",
    },

    isAccountVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

const User = mongoose.model("User", UserSchema);

module.exports = User;
