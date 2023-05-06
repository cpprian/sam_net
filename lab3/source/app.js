const express = require('express');
const ejs = require('ejs');
const path = require('path');
const fs = require('fs');
const url = require('url');
const qs = require('qs');

const port = 4080;
const sourcePath = "./source/static/"; // FIXME: check is it still work on docker
const videoType = "video/mp4";
const audioType = "audio/mp3";

const app = express();
app.set('view engine', 'html');
app.engine('html', ejs.renderFile);
app.use(express.static(path.join(__dirname, '/public')));

app.get("/", function (req, res) {
    const queryObject = qs.parse(url.parse(req.url).query);

    const params = {
        videoId: queryObject.videoFile ? 'videoPlayer' : null,
        audioId: queryObject.audioFile ? 'audioPlayer' : null,
        posterId: queryObject.imgFile ? 'posterImage' : null,
        audioSrc: queryObject.audioFile || null,
        videoSrc: queryObject.videoFile || null,
        imgSrc: queryObject.imgFile || null,
        audioTypeFile: queryObject.audioFile ? videoType : null,
        videoTypeFile: queryObject.videoFile ? audioType : null,
    };

    res.render(path.join(__dirname, "index.ejs"), params);
});

app.get("/video/:videoSrc", function (req, res) {
    console.log("hello");
    generateStreamPipe(res, videoType, sourcePath + req.params.videoSrc);
});

app.get("/audio/:audioSrc", function (req, res) {
    generateStreamPipe(res, audioType, sourcePath + req.params.audioSrc);
});

app.get("/img/:imgSrc", function (req, res) {
    const absolutePath = path.resolve(__dirname, "static/" + req.params.imgSrc);
    res.sendFile(absolutePath);
});

app.get("/css/:style", function (req, res) {
    const absolutePath = path.resolve(__dirname, "css/" + req.params.style);
    res.sendFile(absolutePath);
});

function generateStreamPipe(response, mediaType, mediaPath) {
    const mediaSize = fs.statSync(mediaPath).size - 1;

    const headers = {
        "Content-Range": `bytes ${mediaSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": mediaSize,
        "Content-Type": mediaType,
    };

    response.writeHead(206, headers);
    const audioStream = fs.createReadStream(mediaPath, { mediaSize });
    audioStream.pipe(response);
}

app.listen(port, function () {
    console.log("Listening on port 4080!");
});