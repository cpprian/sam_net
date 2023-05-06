const express = require('express');
const bodyParser = require('body-parser'); // TODO: find better way to parse query params
const url = require('url');
const fs = require('fs');

const app = express();
const port = 4080;

app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  const queryObject = url.parse(req.url, true).query;
  console.log(queryObject);

  let playerTag;
  let playerId;
  let fileSrc;
  let imgSrc;
  let typeFile;

  if (queryObject.videoFile) {
    playerTag = 'video';
    playerId = 'videoPlayer';
    typeFile = 'video/mp4';
    fileSrc = queryObject.videoFile;
  }

  if (queryObject.audioFile) {
    playerTag = 'audio';
    playerId = 'audioPlayer';
    typeFile = 'audio/mp3';
    fileSrc = queryObject.audioFile;
  }

  if (queryObject.imgFile) {
    imgSrc = queryObject.imgFile;
  }

  let html = '';
  if (playerTag && playerId && fileSrc) {
    fs.readFile(fileSrc, function(err, data) {
      if (err) {
        console.log(err)
        return;
      }
      html = `<${playerTag} id="${playerId}" controls><source 
      src="data:${typeFile};base64,${data.toString('base64')}" type="${playerTag}">
      </${playerTag}>${html}`;

      if (imgSrc) {
        fs.readFile(imgSrc, function(err, data) {
          if (err) {
            console.log(err)
            return;
          }
          html += `<img id="posterImage" src="data:image/jpeg;base64,${data.toString('base64')}">${html}`;

          if (queryObject.videoFile) {
            html += `<button id="videoCancel" onclick="document.getElementById('${playerId}').src = '${fileSrc}'">Cancel Video</button>`;
          }
          if (queryObject.audioFile) {
            html += `<button id="audioCancel" onclick="document.getElementById('${playerId}').src = '${fileSrc}'">Cancel Audio</button>`;
          }

          res.send(`<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Hello World Player</title></head><body>${html}</body></html>`);
        });
      } else {
        if (queryObject.videoFile) {
          html += `<button id="videoCancel" onclick="document.getElementById('${playerId}').src = '${fileSrc}'">Cancel Video</button>`;
        }
        if (queryObject.audioFile) {
          html += `<button id="audioCancel" onclick="document.getElementById('${playerId}').src = '${fileSrc}'">Cancel Audio</button>`;
        }

        res.send(`<!DOCTYPE html><html><head><meta charset="UTF-8"><title"><title>Hello World Player</title></head><body>${html}</body></html>`);
      }
    });


  } else {
    html = 'Hello World Player';  
    res.send(`<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Hello World Player</title></head><body>${html}</body></html>`);
  }
});

app.listen(port, () => {
  console.log(`Hello World Player app listening at http://localhost:${port}`);
});