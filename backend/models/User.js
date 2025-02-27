const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    whatsapp: { type: String, required: true },
      // existing fields
      isVerified: {
        type: Boolean,
        default: false
      }
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
