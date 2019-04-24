const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  cookbook: [{ type: mongoose.Schema.Types.ObjectId, ref: "Recipe" }],
  friends: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  diets: [String],
  potLuckOwned: [{ type: mongoose.Schema.Types.ObjectId, ref: "Potluck" }],
  potLuckPart: [{ type: mongoose.Schema.Types.ObjectId, ref: "Potluck" }]
});

userSchema.methods.hashPassword = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
};

userSchema.methods.validate = function(password) {
  return bcrypt.compareSync(password, this.password);
};

userSchema.pre("save", function(next) {
  if (this.isModified("password")) {
    this.hashPassword(this.password);
  }
  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
