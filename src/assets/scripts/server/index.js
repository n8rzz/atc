import express from 'express';
import http from 'http';
import SocketIO from 'socket.io';
import path from 'path';
import chalk from 'chalk';
import uuid from 'uuid4';
import _has from 'lodash/has';
import _omit from 'lodash/omit';

import ConnectClientModel from './ConnectedClient/ConnectedClientModel';
import { EVENTS } from './socketEventNames';

const app = express();
const server = http.Server(app);
const io = new SocketIO(server);

const PORT = process.env.PORT || 3003;
let sockets = {};-

app.use('/assets', express.static(path.join(__dirname, '/../../../assets')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/../../../index.html'));
});

io.on(EVENTS.CONNECTION, (socket) => {
    const clientId = socket.handshake.query.clientId;

    if (!uuid.valid(clientId)) {
        console.log('ERROR');
    }

    const currentUser = new ConnectClientModel({
        id: socket.id,
        clientId: clientId,
        ping: -1,
    });

    if (!_has(sockets, clientId)) {
        sockets[clientId] = currentUser;
    }

    console.log(chalk.magenta(`[CONNECTION] User ${clientId} connected!`));
    console.log(chalk.dim(`${Object.keys(sockets).length} total users connected`));

    io.emit('userJoin');

    const startPingTime = Date.now();
    socket.emit('ding');
    socket.on('dong', () => {
        const latency = Date.now() - startPingTime;

        sockets[clientId].ping = latency;
        console.log(chalk.dim(`::: DING ${latency}ms`));
    });

    socket.on(EVENTS.DISCONNECT, () => {
        if (_has(sockets, clientId)) {
            console.log(chalk.red(`[DISCONNECT] User ${clientId} disconnected!`));

            sockets[clientId].destroy();
            sockets = _omit(sockets, clientId);
        }

        console.log(chalk.dim(`${Object.keys(sockets).length} total users connected`));

        socket.broadcast.emit('userDisconnect', { clientId: clientId });
    });
});

server.listen(PORT, () => {
    console.log(chalk.green.bold(`Listening on PORT ${PORT}`));
});
