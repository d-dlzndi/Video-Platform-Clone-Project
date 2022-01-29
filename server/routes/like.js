const express = require('express');
const router = express.Router();
const { Like } = require('../models/Like');
const { Dislike } = require('../models/Dislike');

//=================================
//             Like
//=================================

router.post("/getLikes", (req, res) => {
    let variable = {};
    if (req.body.videoId){
        variable = { videoId: req.body.videoId };
    } else {
        variable = { commentId: req.body.commentId };
    }

    Like.find(variable)
    .exec((err, likes) => {
        if (err) return res.json({ success: false, err })
        res.status(200).json({ success: true, likes})
    })
})

router.post("/getDislikes", (req, res) => {
    let variable = {};
    if (req.body.videoId){
        variable = { videoId: req.body.videoId };
    } else {
        variable = { commentId: req.body.commentId };
    }

    Dislike.find(variable)
    .exec((err, dislikes) => {
        if (err) return res.json({ success: false, err })
        res.status(200).json({ success: true, dislikes})
    })
})

router.post("/upLike", (req, res) => {
    let variable = {};
    if (req.body.videoId){
        variable = { userId: req.body.userId, videoId: req.body.videoId };
    } else {
        variable = { userId: req.body.userId, commentId: req.body.commentId };
    }
    console.log(req.body);
    const like = new Like(req.body);
    like.save((err, result) => {
        if (err) return res.json({ success: false, err })

        Dislike.findOneAndDelete(variable)
            .exec((err, result) => {
                if (err) return res.json({ success: false, err })
                res.status(200).json({ success: true, result})
            })
    })
})

router.post("/upDislike", (req, res) => {
    let variable = {};
    if (req.body.videoId){
        variable = { userId: req.body.userId, videoId: req.body.videoId, commentId: null };
    } else {
        variable = { userId: req.body.userId, videoId: null, commentId: req.body.commentId };
    }

    const like = new Dislike(variable);
    like.save((err, result) => {
        if (err) return res.json({ success: false, err })

        Like.findOneAndDelete(variable)
            .exec((err, result) => {
                if (err) return res.json({ success: false, err })
                res.status(200).json({ success: true, result})
            })
    })
})

router.post("/downLike", (req, res) => {
    let variable = {};
    if (req.body.videoId){
        variable = { userId: req.body.userId, videoId: req.body.videoId };
    } else {
        variable = { userId: req.body.userId, commentId: req.body.commentId };
    }

    Like.findOneAndDelete(variable)
    .exec((err, result) => {
        if (err) return res.json({ success: false, err })
        res.status(200).json({ success: true, result})
    })
})

router.post("/downDislike", (req, res) => {
    let variable = {};
    if (req.body.videoId){
        variable = { userId: req.body.userId, videoId: req.body.videoId };
    } else {
        variable = { userId: req.body.userId, commentId: req.body.commentId };
    }

    Dislike.findOneAndDelete(variable)
    .exec((err, result) => {
        if (err) return res.json({ success: false, err })
        res.status(200).json({ success: true, result})
    })
})

module.exports = router;
