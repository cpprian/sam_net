const express = require('express')

const app = express()

app.get('/:videoId/:audioId', (req, res) => {
    const { videoId, audioId } = req.params
    res.send(`videoId: ${videoId}, audioId: ${audioId}`)
})

app.listen(4080)
