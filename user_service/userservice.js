const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  restaurantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant',
  },
  items: [{
    pizzaName: { type: String},
    quantity: { type: Number},
  }],
  totalPrice: { type: Number},
  orderDate: { type: Date, default: Date.now },
  deliveryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Delivery',
  },
});

const userSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Users' },
  name:{type : String},
  city: { type: String},
  onlineRestaurants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant',
  }],
  orderHistory: [orderSchema],
});

const User = mongoose.model('User', userSchema);

module.exports = User;
