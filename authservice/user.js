const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name : String,
    email : String,
    password:String,
    city: String,
    created_at:{
        type:Date,
        default:Date.now(),
    }
})

module.exports = Users = mongoose.model("users", userSchema);