// delivery-service/models/Delivery.js

const mongoose = require('mongoose');

const deliverySchema = new mongoose.Schema({
  status: { type: String, default: 'Pending' },
});

const Delivery = mongoose.model('Delivery', deliverySchema);

module.exports = Delivery;
