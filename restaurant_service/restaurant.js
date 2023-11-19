const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MenuItemSchema = new mongoose.Schema({

    name: {
        type: String,
       
    },
    price: {
        type: Number,
       
        validate: {
            validator: Number.isInteger,
            message: '{VALUE} is not an integer value for price.',
        },
    },
});

const restaurentSchema = new Schema({
    restaurentname: {
        type: String,
    },
    email : {
        type: String,
    },
    password:{
        type: String,
    },
    city: {
        type: String,
    },
    menu: [{     type: MenuItemSchema,
        default: function () {
            return { _id: mongoose.Types.ObjectId(), ...this.menu };
        }}], 
    online: {
        type: Boolean,
    },
});

module.exports = User = mongoose.model("restaurant", restaurentSchema);