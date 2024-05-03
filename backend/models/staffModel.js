const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Schema = mongoose.Schema;

const staffSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ["Manager", "Receptionist", "Housekeeper"],
    required: true,
  },
  status: {
    type: String,
    required: true,
    default: "Active"

  }
 
},{timestamps: true});

staffSchema.statics.signup = async function (username, password, role) {
  const exists = await this.findOne({ username });
  //validation
  if (!username || !password || !role ) {
    throw Error("All fields must be filled ");
  }

  if (exists) {
    throw Error("Username already in use");
  }

  const salt = await bcrypt.genSalt(3);
  const hash = await bcrypt.hash(password, salt);

  const staff = await this.create({ username, password: hash, role, });

  return staff;
};

staffSchema.statics.login = async function (email, password) {
  if (!username || !password) {
    throw Error("All fields must be filled ");
  }
  const staff = await this.findOne({ username });

  if (!staff) {
    throw Error("Incorrect email");
  }

  const match = await bcrypt.compare(password, staff.password)
  if(!match){
    throw Error('Incorrect password')
  }
return staff
};
module.exports = mongoose.model("Staff", staffSchema);
