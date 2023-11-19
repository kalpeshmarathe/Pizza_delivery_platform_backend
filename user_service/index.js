const express = require('express');
const amqp = require("amqplib");
const app = express();
const PORT = process.env.PORT_ONE || 9090;
const Delivery =  require("../delivery_service/delivery")
const User = require("./userservice")
const mongoose = require('mongoose');


var channel , connection;

async function connectToMongoDB() {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/UserService", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw error;
  }
}

connectToMongoDB();

app.use(express.json());


async function connect()
{
    const amqpServer = "amqp://localhost:5672";
    connection = await amqp.connect(amqpServer);
    channel = await connection.createChannel();
    await channel.assertQueue("UserService");

    channel.consume("UserService", (msg) => {
      console.log(`Received message: ${msg.content.toString()}`);
      // Further processing logic here
  });

}

connect();



app.post('/user/place-order', async (req, res) => {
  try {
    const { restaurantId, userId , name , items, pizzaName , quantity } = req.body;
  

    const order = {
      restaurantId,
      userId,
      name,
      items:[{pizzaName},{quantity}],
      totalPrice: calculateTotalPrice(items), // You need to implement this function
    };
    const user = new User({ userId }); // Assuming 'name' is a required field for a user

    user.orderHistory.push(order);
    await user.save();
    channel.sendToQueue("UserService", Buffer.from(JSON.stringify(order)));
    res.json({ message: 'Order placed successfully', order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.get('/api/users/:userId/order-history', async (req, res) => {
  try {
    const userId = req.params.userId;

    // Find the user by userId
    const user = await User.findOne({ userId });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Return the order history
    res.json({ orderHistory: user.orderHistory });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


function calculateTotalPrice(items) {
 
  const pizzaPrice = 10; 
  const totalPrice = items.reduce((sum, item) => sum + item.quantity * pizzaPrice, 0);
  return totalPrice;
}

app.listen(PORT , () => {
    console.log(`Server is running on port ${PORT}`);
});
