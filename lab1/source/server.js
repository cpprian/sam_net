const express = require('express');
const bodyParser = require('body-parser');
const url = require('url');
const fs = require('fs');

const app = express();
const port = 4080;

app.use(bodyParser.urlencoded({ extended: true }));
app.use('/static', express.static('static'));

app.get('/', (req, res) => {
  const queryObject = url.parse(req.url, true).query;

  let playerTag;
  let playerId;
  let fileSrc;
  let imgSrc;

  if (queryObject.videoFile) {
    playerTag = 'video';
    playerId = 'videoPlayer';
    fileSrc = queryObject.videoFile;
  }

  if (queryObject.audioFile) {
    playerTag = 'audio';
    playerId = 'audioPlayer';
    fileSrc = queryObject.audioFile;
  }

  if (queryObject.imgFile) {
    imgSrc = queryObject.imgFile;
    console.log("data " + imgSrc);
  }

  let html = '';
  if (playerTag && playerId && fileSrc) {
    html = `<${playerTag} id="${playerId}" controls><source src="${fileSrc}" type="${playerTag}"></${playerTag}>`;

    if (imgSrc) {
      html = `<img id="posterImage" src="${imgSrc}">${html}`;
    }

    if (queryObject.videoFile) {
      html += `<button id="videoCancel" onclick="document.getElementById('${playerId}').src = 'cancel.mp4'">Cancel Video</button>`;
    }
    if (queryObject.audioFile) {
      html += `<button id="audioCancel" onclick="document.getElementById('${playerId}').src = 'cancel.mp3'">Cancel Audio</button>`;
    }
  } else {
    html = 'Hello World Player';  
  }

  res.send(`<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Hello World Player</title></head><body>${html}</body></html>`);
});

app.listen(port, () => {
  console.log(`Hello World Player app listening at http://localhost:${port}`);
});