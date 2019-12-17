module.exports = (app, ws) => {
    const commonUrl = '/api/v1/socket';

    /**
     * @api {post} /v1/socket/send send
     * @apiName SendMessage
     * @apiGroup socket
     * @apiVersion 1.0.0
     *
     * @apiDescription
     * Sends a message to the web-socket by connection_id.
     *
     * @apiParam {Number} connection_id  Mandatory Id of the connection_id.
     * @apiParam {String} event      Optional Name of the event, default "message".
     * @apiParam {JSON}   message    Mandatory Message as JSON.
     *
     * @apiSuccess {String} status Status of the response.
     * @apiSuccess {String} message The message about the performed action.
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *       "status": "ok",
     *       "message": "message sent"
     *     }
     *
     * @apiError ConnectionNotFound The id of the User was not found.
     * @apiError BadRequest A parameter was not passed.
     *
     * @apiErrorExample Error-Response:
     *     HTTP/1.1 404 Not Found
     *     {
     *       "status": "error",
     *       "message": "ConnectionNotFound",
     *     }
     *
     * @apiErrorExample Error-Response:
     *     HTTP/1.1 400 Not Found
     *     {
     *       "status": "error",
     *       "message": "The parameter `connection_id` was not transmitted",
     *     }
     */
    app.post(`${commonUrl}/send`, (req, res) => {
        if (req.body.connection_id === undefined) {
            return res.status(400).send({status: 'error', message: 'The parameter `connection_id` was not transmitted'});
        }

        if (req.body.message === undefined) {
            return res.status(400).send({status: 'error', message: 'The parameter `message` was not transmitted.'});
        }

        try {
            const socketId = ws.connections[req.body.connection_id];
            let socket = ws.of(`/io/ws`).connected[socketId];

            if (socket === undefined) {
                return res.status(404).send({status: 'error', message: 'ConnectionNotFound'});
            }

            if (req.body.event === undefined) {
                socket.send(req.body.message);
            } else {
                socket.emit(req.body.event, req.body.message);
            }
        } catch (e) {
            return res.status(500).send({status: 'error', message: {name: e.name, message: e.message, stack: e.stack}});
        }

        res.send({status: 'ok', message: 'message sent'})
    });

    /**
     * @api {post} /v1/socket/broadcast broadcast
     * @apiName BroadcastMessage
     * @apiGroup socket
     * @apiVersion 1.0.0
     *
     * @apiDescription
     * Sends a message to the web-socket for all users in group.
     *
     * @apiParam {String} event      Optional Name of the event, default "message".
     * @apiParam {JSON}   message    Mandatory Message as JSON.
     *
     * @apiSuccess {String} status Status of the response.
     * @apiSuccess {String} message The message about the performed action.
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *       "status": "ok",
     *       "message": "message sent"
     *     }
     *
     * @apiError ConnectionNotFound The id of the User was not found.
     * @apiError BadRequest A parameter was not passed.
     *
     * @apiErrorExample Error-Response:
     *     HTTP/1.1 404 Not Found
     *     {
     *       "status": "error",
     *       "message": "ConnectionNotFound",
     *     }
     *
     * @apiErrorExample Error-Response:
     *     HTTP/1.1 400 Not Found
     *     {
     *       "status": "error",
     *       "message": "The parameter `message` was not transmitted",
     *     }
     */
    app.post(`${commonUrl}/broadcast`, (req, res) => {
        if (req.body.message === undefined) {
            return res.status(400).send({status: 'error', message: 'The parameter `message` was not transmitted.'});
        }

        try {
            let socket = ws.of(`/io/ws`);

            if (socket === undefined) {
                return res.status(404).send({status: 'error', message: 'ConnectionNotFound'});
            }

            if (req.body.event === undefined) {
                socket.send(req.body.message);
            } else {
                socket.emit(req.body.event, req.body.message);
            }

            return res.send({status: 'ok', message: 'message sent'});
        } catch (e) {
            console.error('[' + new Date().toString() + ']', e);
            return res.status(500).send({status: 'error', message: {name: e.name, message: e.message, stack: e.stack}});
        }
    });

    /**
     * @api {get} /v1/socket/connections connections
     * @apiName GetConnections
     * @apiGroup socket
     * @apiVersion 1.0.0
     *
     * @apiDescription
     * Returns the active client connections.
     *
     * @apiSuccess {String} status Status of the response.
     * @apiSuccess {Array} connections An array containing a ids active connections.
     *
     * @apiSuccessExample Success-Response:
     *      HTTP/1.1 200 OK
     *      {
     *          "status": "ok",
     *          "connections": [
     *              "2362509"
     *          ]
     *      }
     */
    app.get(`${commonUrl}/connections`, (req, res) => {
        try {
            res.send({status: 'ok', connections: Object.keys(ws.connections)});
        } catch (e) {
            return res.status(404).send({status: 'error', message: 'ConnectionNotFound'});
        }
    });
};
