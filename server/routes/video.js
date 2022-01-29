const express = require('express');
const router = express.Router();
const { Video } = require('../models/Video');

const { auth } = require("../middleware/auth");
const multer = require('multer');
const Ffmpeg = require('fluent-ffmpeg');
const { Subscriber } = require('../models/Subscriber');

// multer 사용
const storage_ = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads')
    },
    filename: function (req, file, cb) {
      cb(null, new Date().toISOString().replace(/:/g, '-').replace('.', '') + "_" + file.originalname);
    },
    fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        if (ext !== '.mp4' && ext !== '.avi'){
            return cb(file.status(400).end('only mp4, avi is allowed'), false);
        }
        cb(null, true);
    }
});
const upload = multer({ storage: storage_ }).single("file") // file이라는 이름의 변수로 받아준다.

//=================================
//             Video
//=================================

router.post("/uploadfiles", (req, res) => {
    // req로 파일을 받아와 저장한다.

    upload(req, res, (err) => {
        if (err) {
            console.log(err);
            return res.json({ success: false, err});
        }
        return res.json({ 
            success: true, 
            url: res.req.file.path, 
            fileName: res.req.file.filename
        });
    })
})

router.post("/uploadVideo", (req, res) => {
    // 몽고DB로 파일을 보내준다.
    const video = new Video(req.body);
    
    video.save((err, doc) => {
        if (err) return res.json({ success: false, err });
        res.status(200).json({ success : true, video });
    })
})

router.get("/getVideos", (req, res) => {
    // 비디오 리스트를 DB에서 가져와 리턴한다.
    
    Video.find() //비디오 컬랙션 안에있는 모든 비디오 가져옴.
        .populate('writer') // 이렇게해야 user schema 정보를 가져올수있음.
        .exec((err, videos) => {
            if (err) return res.json({ success: false, err });
            res.status(200).json({ success : true, videos });
        })
})

router.post("/getSubscriptionVideos", (req, res) => {
    // 자신의 아이디로 구독하는 사람을 찾는다.
    Subscriber.find({ userFrom: req.body.userFrom })
        .exec((err, subscriberInfo) => {
            if (err) return res.status(400).send(err);

            let subscribedUser = [];
            subscriberInfo.map((s, i) => {
                subscribedUser.push(s.userTo);
            })

            // 찾은 사람들의 비디오 가지고 온다.
            Video.find({ writer : { $in : subscribedUser }}) // 몽고DB API : $in
                .populate('writer')
                .exec((err, videos) => {
                    if (err) return res.json({ success: false, err });
                    res.status(200).json({ success : true, videos });
                })

        })
})

router.post("/getVideoDetail", (req, res) => {
    Video.findOne({"_id" : req.body.videoId})
        .populate('writer')
        .exec((err, videoDetail) => {
            if (err) return res.json({ success: false, err });
            res.status(200).json({ success : true, videoDetail });
        })
})

router.post("/thumbnail", (req, res) => {
    // 썸네일 생성하고 비디오 러닝타임 정보 등 리턴

    let filePath = "";
    let fileDuration = "";
    let filename = [];

    // 비디오 정보 가져오기
    Ffmpeg.ffprobe(req.body.url, (err, metadata) => {
        console.dir(metadata);
        console.log(metadata.format.duration);
        fileDuration = metadata.format.duration;
    })

    // 썸네일 생성
    Ffmpeg(req.body.url)
    .on('filenames', (filenames) => {
        console.log('Will generate ' + filenames.join(', '));
        filename = filenames;
        filePath = "uploads/thumbnails/" + filenames[0];
    })
    .on('end', ()=>{
        console.log('Screenshots taken ');
        return res.json({ 
            success: true, 
            url: filePath, 
            fileName: filename, 
            fileDuration: fileDuration
        })
    })
    .on('error', (err)=>{
        console.error(err);
        return res.json({ success: false, err});
    })
    .screenshots({
        // Will take screenshots at 20%, 40%, 60% of the video
        count: 3,
        folder: './uploads/thumbnails',
        size: '320x240',
        filename: 'thumbnail-%b.png' // %b : input basename
    })
})

module.exports = router;
