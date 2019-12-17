module.exports = ws => {    
    const namespace = '/io/ws';

    ws.connections = [];

    ws.of(namespace).on('connection', socket => {
        socket.on('join', ({id}) => {
            if (ws.connections[id] !== undefined) {
                const oldSocketId = ws.connections[id];
                ws.of(namespace).connected[oldSocketId].disconnect();
            }

            ws.connections[id] = socket.id;
            socket.connection_id = id;
        });

        const durationConnection = process.env.SOCKET_DURATION_CONNECTION;
        
        if (parseInt(durationConnection) > 0) {
            setTimeout(() => {
                socket.disconnect();
            }, durationConnection);
        }

        socket.on('disconnect', () => {
            delete ws.connections[socket.connection_id];
        });
    });

    return ws;
};
