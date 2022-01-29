const mongoose = require('mongoose');

const commentSchema = mongoose.Schema({
    writer: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User'
    },
    postId: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Video'
    },
    responseTo: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User'
    },
    content: {
        type: String
    }

}, { timestamps : true }); // 업로드 시간 표시


const Comment = mongoose.model('Comment', commentSchema);

module.exports = { Comment }