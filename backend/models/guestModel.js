const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const validator = require("validator");
const Schema = mongoose.Schema;

const guestSchema = new Schema({
  first_name: {
    type: String,
    required: true
  },
  last_name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
},{timestamps: true});

guestSchema.statics.signup = async function (first_name, last_name, email, password) {
  const exists = await this.findOne({ email });
  //validation
  if (!first_name || !last_name || !email || !password) {
    throw Error("All fields must be filled ");
  }
  if (!validator.isEmail(email)) {
    throw Error(`Email isn't valid`);
  }
  if (!validator.isStrongPassword(password)) {
    throw Error(`Password not strong enough`);
  }

  if (exists) {
    throw Error("Email already in use");
  }

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  const guest = await this.create({ first_name, last_name, email, password: hash });

  return guest;
};

guestSchema.statics.login = async function (email, password) {
  if (!email || !password) {
    throw Error("All fields must be filled ");
  }
  const guest = await this.findOne({ email });

  if (!guest) {
    throw Error("Incorrect email");
  }

  const match = await bcrypt.compare(password, guest.password)
  if(!match){
    throw Error('Incorrect password')
  }
return guest
};
module.exports = mongoose.model("Guest", guestSchema);
