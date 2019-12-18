# node-ws-service
WebSocket Node js server and API for it

[![Codacy Badge](https://api.codacy.com/project/badge/Grade/c24e36f67a004df7b3a5f4febb1120ff)](https://www.codacy.com/manual/walkerus/node-ws-service?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=walkerus/node-ws-service&amp;utm_campaign=Badge_Grade)
[![Build Status](https://travis-ci.org/walkerus/node-ws-service.svg?branch=master)](https://travis-ci.org/walkerus/node-ws-service)

## Usage
Run container with service
```sh
docker run -d -e APP_PORT=8081 -e WS_PORT=8082 -p 8081:8081 -p 8082:8082 wolfwalker/node-ws-service
```

Use [Socket.io client](https://socket.io/docs/client-api/) or any other WebSocket client to establish a connection

```js
<script src="http://localhost:8082/socket.io/socket.io.js"></script>
<script>
    const socket = io.connect('ws://localhost:8082/io/ws')
    socket.on('connect', () => {
        // When connecting, you must pass the id with which you can send the message via api
        socket.emit('join', ({id: 123}))
    })
</script>
```

Use the [server API](https://walkerus.github.io/node-ws-service/public/apidoc/index.html) to interact with the WebSocket connections 
