const mongoose = require("mongoose");
const { Schema } = mongoose;
const { Subscription } = require("../../helpers/constants");

const userSchema = new Schema(
  {
    password: {
      type: String,
      minlength: 6,
      required: [true, "Password is required"],
    },
    email: {
      type: String,
      unique: true,
      required: [true, "Email is required"],
    },
    subscription: {
      type: String,
      enum: Object.values(Subscription),
      default: Subscription.STARTER,
    },
    token: {
      type: String,
      default: null,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const User = mongoose.model("user", userSchema);

module.exports = User;
