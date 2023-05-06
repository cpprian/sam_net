const express = require('express');
const ejs = require('ejs');
const path = require('path');
const fs = require('fs');
const url = require('url');
const bodyParser = require('body-parser'); // TODO: find better way to parse query params

const port = 4080;
const sourcePath = "./source/static/"; // FIXME: check is it still work on docker
const videoType = "video/mp4";
const audioType = "audio/mp3";

const app = express();
app.set('view engine', 'html');
app.engine('html', ejs.renderFile);
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true })); // TODO: find better way to parse query params

app.get("/", function (req, res) {
    const queryObject = url.parse(req.url, true).query;
    
    // TODO: refactor this
    let videoId;
    let audioId;
    let posterId;
    let audioSrc;
    let videoSrc;
    let imgSrc;
    let audioTypeFile;
    let videoTypeFile;
  
    if (queryObject.videoFile) {
      videoId = 'videoPlayer';
      videoTypeFile = 'video/mp4';
      videoSrc = queryObject.videoFile;
    }
  
    if (queryObject.audioFile) {
      audioId = 'audioPlayer';
      audioTypeFile = 'audio/mp3';
      audioSrc = queryObject.audioFile;
    }
  
    if (queryObject.imgFile) {
        posterId = 'posterImage';
      imgSrc = queryObject.imgFile;
    }

    res.render(__dirname + "/index.ejs", { videoId, audioId, posterId, audioSrc, videoSrc, imgSrc, audioTypeFile, videoTypeFile});
});

app.get("/video/:videoSrc", function (req, res) {
    generateStreamPipe(res, videoType, sourcePath + req.params.videoSrc);
});

app.get("/audio/:audioSrc", function (req, res) {
    generateStreamPipe(res, audioType, sourcePath + req.params.audioSrc);
});

app.get("/img/:imgSrc", function (req, res) {
    const imagePath = "static/" + req.params.imgSrc;
    const absolutePath = path.resolve(__dirname, imagePath);
    res.sendFile(absolutePath );
});

function generateStreamPipe(response, mediaType, mediaPath) {
    const mediaSize = fs.statSync(mediaPath).size;

    const start = 0;
    const contentLength = mediaSize - 1;
    const headers = {
        "Content-Range": `bytes ${contentLength}`,
        "Accept-Ranges": "bytes",
        "Content-Length": contentLength,
        "Content-Type": mediaType,
    };

    response.writeHead(206, headers);
    const audioStream = fs.createReadStream(mediaPath, { start, contentLength });
    audioStream.pipe(response);
}

app.listen(port, function () {
    console.log("Listening on port 4080!");
});