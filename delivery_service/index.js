const express = require('express');
const amqp = require("amqplib");
const app = express();
const PORT = process.env.PORT_ONE || 1010;
const mongoose = require('mongoose');
const Delivery = require('./delivery')


var channel , connection;

async function connectToMongoDB() {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/DeliveryService", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    // Handle the error accordingly
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
    await channel.assertQueue("DELIVERY");

}

connect();


app.put('/update-status/:deliveryId', async (req, res) => {
    try {
      const deliveryId = req.params.deliveryId;
      const { status } = req.body;
  
      // Update the status of the delivery by ID
      const updatedDelivery = await Delivery.findByIdAndUpdate(
        deliveryId,
        { status },
        { new: true } // Return the updated document
      );
  
      if (!updatedDelivery) {
        return res.status(404).json({ message: 'Delivery not found' });
      }
  
      res.json({ message: 'Delivery status updated successfully', delivery: updatedDelivery });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });

app.listen(PORT , () => {
    console.log(`Server is running on port ${PORT}`);
});
