const mongoose = require('mongoose');

const subscriberSchema = mongoose.Schema({
    userTo: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User'
    },
    userFrom: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User'
    },

}, { timestamps : true }); // 업로드 시간 표시


const Subscriber = mongoose.model('Subscriber', subscriberSchema);

module.exports = { Subscriber }