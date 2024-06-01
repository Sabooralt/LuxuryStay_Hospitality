const mongoose = require('mongoose');

const ServiceOrderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  service: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },
  orderDate: { type: Date, default: Date.now },
  price: { type: Number, required: true },
  status: { type: String, default: 'pending' }
});

const ServiceOrder = mongoose.model('ServiceOrder', ServiceOrderSchema);
module.exports = ServiceOrder;