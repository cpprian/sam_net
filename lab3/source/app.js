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
app.use(express.static(path.join(__dirname, 'public')));

app.get("/", function (req, res) {
    const queryObject = qs.parse(url.parse(req.url).query);

    let params = {
        videoId: null,
        audioId: null,
        posterId: null,
        audioSrc: null,
        videoSrc: null,
        imgSrc: null,
        audioTypeFile: null,
        videoTypeFile: null,
    };

    if (queryObject.videoFile) {
        params.videoId = 'videoPlayer';
        params.videoTypeFile = 'video/mp4';
        params.videoSrc = queryObject.videoFile;
    }

    if (queryObject.audioFile) {
        params.audioId = 'audioPlayer';
        params.audioTypeFile = 'audio/mp3';
        params.audioSrc = queryObject.audioFile;
    }

    if (queryObject.imgFile) {
        params.posterId = 'posterImage';
        params.imgSrc = queryObject.imgFile;
    }

    res.render(path.join(__dirname, "index.ejs"), params);
});

app.get("/video/:videoSrc", function (req, res) {
    generateStreamPipe(res, videoType, sourcePath + req.params.videoSrc);
});

app.get("/audio/:audioSrc", function (req, res) {
    generateStreamPipe(res, audioType, sourcePath + req.params.audioSrc);
});

app.get("/img/:imgSrc", function (req, res) {
    const absolutePath = path.resolve(__dirname, "static/" + req.params.imgSrc);
    res.sendFile(absolutePath);
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