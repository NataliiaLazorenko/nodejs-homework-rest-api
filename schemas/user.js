const { Schema, model } = require("mongoose");
const bcrypt = require("bcryptjs");
const { nanoid } = require("nanoid");
const gravatar = require("gravatar"); // to automatically create default avatar
const { Subscription } = require("../helpers/constants");

const SALT_FACTOR = 10;

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
      validate(value) {
        const re = /\S+@\S+\.\S+/gi;
        return re.test(String(value).toLowerCase());
      },
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
    avatarURL: {
      type: String,
      default: function () {
        return gravatar.url(this.email, { s: 250 }, true); // size 250px; protocol https (false - http)
      },
    },
    // need avatarId when upload avatars to cloud
    // avatarId: {
    //   type: String,
    //   default: null,
    // },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
      required: [true, "Verify token is required"],
      default: nanoid(),
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    const salt = await bcrypt.genSalt(SALT_FACTOR);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

userSchema.methods.validPassword = async function (password) {
  return await bcrypt.compare(String(password), this.password);
};

const User = model("user", userSchema);

module.exports = User;
