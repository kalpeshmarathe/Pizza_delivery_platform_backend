const express = require('express');
const amqp = require("amqplib");
const mongoose =  require('mongoose')
const Restaurent = require("./restaurant")


const app = express();
const PORT = process.env.PORT_ONE || 8080;

var channel , connection;

mongoose.connect("mongodb://127.0.0.1:27017/Restaurentservice", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});


app.use(express.json());


async function connect()
{
    const amqpServer = "amqp://localhost:5672";
    connection = await amqp.connect(amqpServer);
    channel = await connection.createChannel();
    await channel.assertQueue("RESTAURENT");

}

connect();

app.get("/restaurants/:city?", async (req, res) => {
  try {
    const { city } = req.params;

    let query = {};
    if (city) {
      query = { city };
    }

    const onlineRestaurants = await Restaurent.find(query);
    res.json({ restaurants: onlineRestaurants });
  } catch (error) {
    console.error('Error fetching online restaurants:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



app.post("/restaurent/menu/addItem",async (req,res) =>{
    const { restaurantname, name, price } = req.body;
    const restaurant = await Restaurent.findOne({restaurantname:restaurantname});


    if (!restaurant) {
        return res.status(404).json({ message: 'Restaurant not found.' });
    } else {
        const newItem = {
            name,
            price,
        };
        restaurant.menu.push(newItem);
        await restaurant.save();
        return res.status(201).json({ message: 'Menu item added successfully.', restaurant });
  
    }

     
})

app.put('/menu/update-item/:itemId', async (req, res) => {
    try {
      const { itemId } = req.params;
      const { name, price } = req.body;
      const updatedItem = await Restaurent.findByIdAndUpdate(itemId, { name, price }, { new: true });
      res.json({ message: 'Menu item updated successfully', item: updatedItem });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });
  
  app.delete('/menu/remove-item/:itemId', async (req, res) => {
    try {
      const { itemId } = req.params;
      await Restaurent.findByIdAndDelete(itemId);
      res.json({ message: 'Menu item removed successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });
  


app.post("/admin/add-restaurant",async (req,res) =>{
    const {email, password, restaurentname , name , price , online} = req.body;

    const userExists = await Restaurent.findOne({email , restaurentname});


    if (userExists) {
        return res.json("Restaurent Already Exists");
    } else {
        const newrestaurent = new Restaurent({
            restaurentname,
            email,
            password,
            menu:[{name},
            {price}],
            online

        });
        newrestaurent.save();
        return res.json("new reataurant created");
    }

     
})

app.delete('/admin/remove-restaurant/:restaurantId', async (req, res) => {
    try {
        const { restaurantId } = req.params;

        const restaurant = await Restaurent.findById(restaurantId);

        if (!restaurant) {
          return res.status(404).json({ message: 'Restaurant not found' });
        }
    
        await restaurant.deleteOne(); // Use deleteOne instead of remove
        res.json({ message: 'Restaurant removed successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });


app.listen(PORT , () => {
    console.log(`Server is running on port ${PORT}`);
});
