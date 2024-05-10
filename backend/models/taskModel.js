const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const taskSchema = new Schema({
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    deadline: {
      type: Date,
      required: true
    },
    assignedTo: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Staff'
    }],
    assignedAll: {
      type: Boolean,
      default: false
    },
    status: {
      type: String,
      enum: ['Pending', 'In Progress', 'Completed'],
      default: 'Pending'
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  });
  
  module.exports = mongoose.model('Task', taskSchema);
