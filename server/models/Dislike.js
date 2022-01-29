const mongoose = require('mongoose');

const dislikeSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    commentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    },
    viedoId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Video'
    },

}, { timestamps : true }); // 업로드 시간 표시


const Dislike = mongoose.model('Dislike', dislikeSchema);

module.exports = { Dislike }