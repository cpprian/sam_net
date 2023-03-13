const express = require('express');
const bodyParser = require('body-parser');
const url = require('url');

const app = express();
const port = 4080;

app.use(bodyParser.urlencoded({ extended: true }));


app.get('/', (req, res) => {
  const queryObject = url.parse(req.url, true).query;
  res.send(queryObject);

  let playerTag;
  let playerId;
  let fileSrc;

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

  let html = '';
  if (playerTag && playerId && fileSrc) {
    html = `<${playerTag} id="${playerId}" controls><source src="${fileSrc}" type="${playerTag}/mp4"></${playerTag}>`;
  } else {
    html = 'Hello World Player';
  }

  res.send(`<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Hello World Player</title></head><body>${html}</body></html>`);
});

app.listen(port, () => {
  console.log(`Hello World Player app listening at http://localhost:${port}`);
});