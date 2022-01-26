const mongoose = require('mongoose');

const videoSchema = mongoose.Schema({
    writer: {
        type: mongoose.Schema.Types.ObjectId, // id만 넣어도 User 모델의 모든 정보를 긁어올 수 있음.
        ref: 'User'
    },
    title: {
        type: String,
        maxlength: 50
    },
    description: {
        type: String
    },
    privacy: {
        type: Number
    },
    filePath: {
        type: String
    },
    category: {
        type: String
    },
    views: {
        type: Number,
        default: 0
    },
    duration: {
        type: String
    },
    thumbnail: {
        type: String
    }

}, { timestamps : true }); // 업로드 시간 표시


const Video = mongoose.model('Video', videoSchema);

module.exports = { Video }