const mongoose = require("mongoose");
const { Schema, SchemaTypes } = mongoose;
const mongoosePaginate = require("mongoose-paginate-v2");

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
      required: true,
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
    owner: {
      type: SchemaTypes.ObjectId,
      ref: "user",
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

contactSchema.plugin(mongoosePaginate);

const Contact = mongoose.model("contact", contactSchema);

module.exports = Contact;
