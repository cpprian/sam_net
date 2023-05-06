const express = require('express');
const ejs = require('ejs');
const path = require('path');
const fs = require('fs');
const url = require('url');
const bodyParser = require('body-parser'); // TODO: find better way to parse query params

const port = 4080;

const app = express();
app.set('view engine', 'html');
app.engine('html', ejs.renderFile);
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true })); // TODO: find better way to parse query params

app.get("/", function (req, res) {
    const queryObject = url.parse(req.url, true).query;
    console.log(queryObject);
    
    // TODO: refactor this
    let videoPlayerTag;
    let audioPlayerTag;
    let videoId;
    let audioId;
    let audioSrc;
    let videoSrc;
    let imgSrc;
    let audioTypeFile;
    let videoTypeFile;
  
    if (queryObject.videoFile) {
      videoPlayerTag = 'video';
      videoId = 'videoPlayer';
      videoTypeFile = 'video/mp4';
      videoSrc = queryObject.videoFile;
    }
  
    if (queryObject.audioFile) {
      audioPlayerTag = 'audio';
      audioId = 'audioPlayer';
      audioTypeFile = 'audio/mp3';
      audioSrc = queryObject.audioFile;
    }
  
    if (queryObject.imgFile) {
      imgSrc = queryObject.imgFile;
    }

    console.log('\nvideoPlayerTag', videoPlayerTag, '\naudioPlayerTag', audioPlayerTag, '\nvideoId', videoId, '\naudioId', audioId, '\naudioSrc', audioSrc, '\nvideoSrc', videoSrc, '\nimgSrc', imgSrc, '\naudioTypeFile', audioTypeFile, '\nvideoTypeFile', videoTypeFile);

    res.render(__dirname + "/index.ejs", { videoPlayerTag, audioPlayerTag, videoId, audioId, audioSrc, videoSrc, imgSrc, audioTypeFile, videoTypeFile});
});

app.get("/video/:videoSrc", function (req, res) {
    const videoPath = "./source/static/" + req.params.videoSrc; // FIXME: check is it still work on docker
    const videoSize = fs.statSync(videoPath).size;

    const start = 0;
    const contentLength = videoSize - 1;
    const headers = {
        "Content-Range": `bytes ${contentLength}`,
        "Accept-Ranges": "bytes",
        "Content-Length": contentLength,
        "Content-Type": "video/mp4",
    };

    res.writeHead(206, headers);
    const videoStream = fs.createReadStream(videoPath, { start, contentLength });
    videoStream.pipe(res);
});

app.get("/audio/:audioSrc", function (req, res) {
    const audioPath = "./source/static/" + req.params.audioSrc; // FIXME: check is it still work on docker
    const audioSize = fs.statSync(audioPath).size;

    const start = 0;
    const contentLength = audioSize - 1;
    const headers = {
        "Content-Range": `bytes ${contentLength}`,
        "Accept-Ranges": "bytes",
        "Content-Length": contentLength,
        "Content-Type": "audio/mp3",
    };

    res.writeHead(206, headers);
    const audioStream = fs.createReadStream(audioPath, { start, contentLength });
    audioStream.pipe(res);
});

app.get("/img/:imgSrc", function (req, res) {
    const imagePath = "static/" + req.params.imgSrc;
    const absolutePath = path.resolve(__dirname, imagePath);
    res.sendFile(absolutePath );
});

app.listen(port, function () {
    console.log("Listening on port 4080!");
});