const mongoose = require('mongoose');

const likeSchema = mongoose.Schema({
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


const Like = mongoose.model('Like', likeSchema);

module.exports = { Like }