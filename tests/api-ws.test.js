const request = require('supertest')
const server = require('../server.js')
const socketClient  = require('socket.io-client')

const wsPort = process.env.TEST_WS_PORT || 82
const wsAddress = `ws://localhost:${wsPort}/io/ws`

function join(socket, id) {
    socket.on('connect', () => {
        socket.emit('join', ({id: id}))
    })
}

function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

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
    server.wsServer.listen(wsPort)
    const socket = socketClient.connect(wsAddress)
    const expectedConnectionId = '123'

    join(socket, expectedConnectionId)

    await timeout(50)
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
    server.wsServer.listen(wsPort)
    const socket = socketClient.connect(wsAddress)
    const socketOneMore = socketClient.connect(wsAddress)
    const expectedConnections = ['123', '1234']

    join(socket, expectedConnections[0])
    join(socketOneMore, expectedConnections[1])

    await timeout(50)
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
    server.wsServer.listen(wsPort)
    const socket = socketClient.connect(wsAddress)
    const socketOneMore = socketClient.connect(wsAddress)
    const expectedConnection = '1234'

    join(socket, 1)
    join(socketOneMore, expectedConnection)

    socket.disconnect()

    await timeout(100)
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
    server.wsServer.listen(wsPort)
    let socket = socketClient.connect(wsAddress)
    const connectionId = '123'
    const testEvent = 'test_event'
    const expectedMessage = 'foo message'

    join(socket, connectionId)

    socket.on(testEvent, message => {
        if (message.body !== expectedMessage) {
            throw `expected ${expectedMessage} message`
        }

        socket.close()
        socket = socketClient.connect(wsAddress)

        join(socket, expectedMessage)
    })

    await timeout(100)
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

    await timeout(100)
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
    server.wsServer.listen(wsPort)
    let socket = socketClient.connect(wsAddress)
    let socketOneMore = socketClient.connect(wsAddress)
    const testEvent = 'test_event'
    const expectedMessage = ['foo', 'bar']

    join(socket, 1)
    join(socketOneMore, 2)

    socket.on(testEvent, message => {
        if (JSON.stringify(message.body) !== JSON.stringify(expectedMessage)) {
            throw `expected ${expectedMessage} message`
        }

        socket.close()
        socket = socketClient.connect(wsAddress)

        join(socket, expectedMessage[0])
    })

    socketOneMore.on(testEvent, message => {
        if (JSON.stringify(message.body) !== JSON.stringify(expectedMessage)) {
            throw `expected ${expectedMessage} message`
        }

        socketOneMore.close()
        socketOneMore = socketClient.connect(wsAddress)

        join(socketOneMore, expectedMessage[1])
    })

    await timeout(100)
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

    await timeout(100)
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
