const server = require('./server.js')

const appPort = process.env.APP_PORT || 80;
const wsPort = process.env.WS_PORT || 81;

server.appServer.listen(appPort, () => {
    console.log('[' + new Date().toString() + ']', `Express app server listening on port ${appPort}`);
})

server.wsServer.listen(wsPort, () => {
    console.log('[' + new Date().toString() + ']', `Express ws server listening on port ${wsPort}`);
})

