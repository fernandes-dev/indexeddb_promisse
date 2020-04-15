const express = require('express')
const app = express()
const path = require('path')
const router = express.Router()
const cors = require('cors')
// const https = require('https')
// const fs = require('fs')
const port = process.env.port || 8080

app.use(router)
app.use(cors())

app.use("/static", express.static('./src/app/static/'))

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/index.html'))
})

router.get('/sw', (req, res) => {
    res.sendFile(path.join(__dirname + '/sw.js'))
})

router.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname + '/src/app/view/register.html'))
})

// https.createServer({
//     key: fs.readFileSync('./key.pem'),
//     cert: fs.readFileSync('./cert.pem'),
//     passphrase: '1306'
// }, app).listen(port)

app.listen(port)