//get all posts from database
const User = require("../models/user_model");

const createUser = async (req,res,next) => {
    console.log("arrived");
    console.log(req.body);
    try{
    const user = await User.create(req.body);
    res.status(201).send(user);
    } catch (error) {
    res.status(400).send(error.message);
    }
}

module.exports = {createUser}