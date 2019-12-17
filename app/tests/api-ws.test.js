const request = require('supertest')
const server = require('../server.js')
const socketClient  = require('socket.io-client')

it("shoud get empty connection array", async () => {
    await request(server.appServer)
      .get('/api/v1/socket/connections')
      .send()
      .expect(200, {
        connections: [],
        status: 'ok'
      })
})

it("shoud get one connection", async () => {
    server.wsServer.listen(88)
    const socket = socketClient.connect('ws://localhost:88/io/ws')
    const expectedConnectionId = '123'

    socket.on('connect', () => {
        socket.emit('join', ({id: expectedConnectionId}))
    })

    await new Promise(resolve => setTimeout(resolve, 50))
    await request(server.appServer)
        .get('/api/v1/socket/connections')
        .send()
        .expect(200, {
          connections: [expectedConnectionId],
          status: 'ok'
        })

    socket.close()
    server.wsServer.close()
})

it("shoud get few connections", async () => {
    server.wsServer.listen(88)
    const socket = socketClient.connect('ws://localhost:88/io/ws')
    const socketOneMore = socketClient.connect('ws://localhost:88/io/ws')
    const expectedConnections = ['123', '1234']

    socket.on('connect', () => {
        socket.emit('join', ({id: expectedConnections[0]}))
    })

    socketOneMore.on('connect', () => {
        socketOneMore.emit('join', ({id: expectedConnections[1]}))
    })

    await new Promise(resolve => setTimeout(resolve, 50))
    await request(server.appServer)
        .get('/api/v1/socket/connections')
        .send()
        .expect(200, {
            connections: expectedConnections,
            status: 'ok'
        })

    socketOneMore.close()
    socket.close()
    server.wsServer.close()
})

it("shoud get one connection after diconnect one more", async () => {
    server.wsServer.listen(88)
    const socket = socketClient.connect('ws://localhost:88/io/ws')
    const socketOneMore = socketClient.connect('ws://localhost:88/io/ws')
    const expectedConnection = '1234'

    socket.on('connect', () => {
        socket.emit('join', ({id: 1}))
    })

    socketOneMore.on('connect', () => {
        socketOneMore.emit('join', ({id: expectedConnection}))
    })

    socket.disconnect()

    await new Promise(resolve => setTimeout(resolve, 100))
    let res = await request(server.appServer)
        .get('/api/v1/socket/connections')
        .send()
        .expect(200, {
            connections: [expectedConnection],
            status: 'ok'
        })

    socketOneMore.close()
    socket.close()
    server.wsServer.close()
})

it("shoud get connection not found", async () => {
    await request(server.appServer)
        .post('/api/v1/socket/send')
        .send({
            event: 'some',
            connection_id: 123,
            message: {
                body: 'foo'
            }
        })
        .expect(404, {
            status: 'error',
            message: 'ConnectionNotFound'
        })
})

it("send message", async () => {
    server.wsServer.listen(88)
    let socket = socketClient.connect('ws://localhost:88/io/ws')
    const connectionId = '123'
    const testEvent = 'test_event'
    const expectedMessage = 'foo message'

    socket.on('connect', () => {
        socket.emit('join', ({id: connectionId}))
    })

    socket.on(testEvent, message => {
        if (message.body !== expectedMessage) {
            throw `expected ${expectedMessage} message`
        }

        socket.close()
        socket = socketClient.connect('ws://localhost:88/io/ws')

        socket.on('connect', () => {
            socket.emit('join', ({id: expectedMessage}))
        })
    })

    await new Promise(resolve => setTimeout(resolve, 100))
    await request(server.appServer)
        .post('/api/v1/socket/send')
        .send({
            event: testEvent,
            connection_id: connectionId,
            message: {
                body: expectedMessage
            }
        })
        .expect(200, {
            status: 'ok',
            message: 'message sent'
        })

    await new Promise(resolve => setTimeout(resolve, 100))
    await request(server.appServer)
        .get('/api/v1/socket/connections')
        .send()
        .expect(200, {
            connections: [expectedMessage],
            status: 'ok'
        })

    socket.close()
    server.wsServer.close()
    await new Promise(resolve => setTimeout(resolve, 100))
})


it("send broadcast message", async () => {
    server.wsServer.listen(88)
    let socket = socketClient.connect('ws://localhost:88/io/ws')
    let socketOneMore = socketClient.connect('ws://localhost:88/io/ws')
    const testEvent = 'test_event'
    const expectedMessage = ['foo', 'bar']

    socket.on('connect', () => {
        socket.emit('join', ({id: 1}))
    })

    socketOneMore.on('connect', () => {
        socketOneMore.emit('join', ({id: 2}))
    })

    socket.on(testEvent, message => {
        if (JSON.stringify(message.body) !== JSON.stringify(expectedMessage)) {
            throw `expected ${expectedMessage} message`
        }

        socket.close()
        socket = socketClient.connect('ws://localhost:88/io/ws')

        socket.on('connect', () => {
            socket.emit('join', ({id: expectedMessage[0]}))
        })

        socket.a = 54321
    })

    socketOneMore.on(testEvent, message => {
        if (JSON.stringify(message.body) !== JSON.stringify(expectedMessage)) {
            throw `expected ${expectedMessage} message`
        }

        socketOneMore.close()
        socketOneMore = socketClient.connect('ws://localhost:88/io/ws')

        socketOneMore.on('connect', () => {
            socketOneMore.emit('join', ({id: expectedMessage[1]}))
        })
    })

    await new Promise(resolve => setTimeout(resolve, 100))
    await request(server.appServer)
        .post('/api/v1/socket/broadcast')
        .send({
            event: testEvent,
            message: {
                body: expectedMessage
            }
        })
        .expect(200, {
            status: 'ok',
            message: 'message sent'
        })

    await new Promise(resolve => setTimeout(resolve, 100))
    await request(server.appServer)
        .get('/api/v1/socket/connections')
        .send()
        .expect(200, {
            connections: expectedMessage,
            status: 'ok'
        })

    socket.close()
    socketOneMore.close()
    server.wsServer.close()
})
