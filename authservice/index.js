const express = require('express');
const app = express();
const PORT = process.env.PORT_ONE || 7070;
const user = require("./user");

const mongoose =  require('mongoose')
mongoose.connect("mongodb://127.0.0.1:27017/Authservice", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

app.use(express.json());

app.post("/auth/login" , async (req, res) => {
    const {email, password} = req.body;

    const userExists = await user.findOne({email,password});
    if (!userExists) {
        return res.json("user not exist");
    }

    return res.json("success");
});

app.post("/auth/register", async (req, res) => {
    const {email, password, name} = req.body;
    const userExists = await user.findOne({email});

    if (userExists) {
        return res.json("User Already Exists");
    } else {
        const newUser = new user({
            name,
            email,
            password
        });
        newUser.save();
        return res.json("new user created");
    }
});

app.listen(PORT , () => {
    console.log(`Server is running on port ${PORT}`);
});
