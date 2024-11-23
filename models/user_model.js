const mongoose = require('mongoose')

var commentSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
    } 
});
module.exports = mongoose.model('User',commentSchema) 