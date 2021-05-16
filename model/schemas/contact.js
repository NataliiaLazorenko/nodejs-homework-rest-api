const mongoose = require("mongoose");
const { Schema } = mongoose;

const contactSchema = new Schema(
  {
    name: {
      type: String,
      minlength: 2,
      maxlength: 30,
      required: [true, "Set name for contact"],
    },
    email: {
      type: String,
      unique: true,
      required: [true, "Set unique email"],
    },
    phone: {
      type: String,
      minlength: 5,
      maxlength: 20,
    },
    favorite: {
      type: Boolean,
      default: false,
    },
  },
  {
    versionKey: false,
    // timestamps: true,
    toObject: {
      virtuals: true,

      transform: function (doc, ret) {
        delete ret._id;
        return ret;
      },
    },
    toJSON: {
      virtuals: true,

      transform: function (doc, ret) {
        delete ret._id;
        return ret;
      },
    },
  }
);

const Contact = mongoose.model("contact", contactSchema);

module.exports = Contact;
