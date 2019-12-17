const server = require('./server.js')

const appPort = process.env.APP_PORT || 80;
const wsPort = process.env.WS_PORT || 81;

server.appServer.listen(appPort)
server.wsServer.listen(wsPort)
