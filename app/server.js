const express = require('express')
const bodyParser = require('body-parser')
const http = require('http')
const wsHandler = require('./ws-handler.js')
const api = require('./api/socket/v1/api.js')
const socket = require('socket.io')

const app = express()
app.use(bodyParser.json())
app.use(express.static('./public'))

const httpAppServer = http.createServer(app)

const httpWsServer = http.createServer(express())
let ws = socket(httpWsServer, { origins: '*:*' })

wsHandler(ws)
api(app, ws)

module.exports.appServer = httpAppServer
module.exports.wsServer = httpWsServer
