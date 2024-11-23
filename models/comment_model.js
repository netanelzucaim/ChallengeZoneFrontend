const mongoose = require('mongoose')

var commentSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
    },
    detail: {
        type: String,
        required: true,
    },
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        required: true,
    }
  });
module.exports = mongoose.model('Comment',commentSchema) 