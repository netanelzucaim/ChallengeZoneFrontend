const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var userSchema = new Schema({
    userName: {
        type: String,
        required: true,
    } 
});

const Users = mongoose.model("User", userSchema);
module.exports = Users;