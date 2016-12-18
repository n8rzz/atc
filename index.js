require('assets/scripts/server');
// const express = require('express');
// const http = require('http');
// const SocketIO = require('socket.io');
// const path = require('path');
// const chalk = require('chalk');
// const uuid = require('uuid4');
// const _has = require('lodash/has');
// const _omit = require('lodash/omit');
//
// const app = express();
// const server = http.Server(app);
// const io = new SocketIO(server);
//
// const PORT = process.env.PORT || 3003;
// let sockets = {};
//
// app.use('/assets', express.static(path.join(__dirname, '/assets')));
//
// app.get('/', (req, res) => {
//     res.sendFile(path.join(__dirname, '/index.html'));
// });
//
// io.on('connection', (socket) => {
//     const clientId = socket.handshake.query.clientId;
//
//     if (!uuid.valid(clientId)) {
//         console.log('ERROR');
//     }
//
//     const currentUser = {
//         id: socket.id
//     };
//
//     if (!_has(sockets, clientId)) {
//         sockets[clientId] = currentUser;
//     }
//
//     console.log(chalk.magenta(`[INFO] User ${clientId} connected!`));
//     console.log(chalk.dim(`${Object.keys(sockets).length} total users connected`));
//
//     io.emit('userJoin');
//
//     socket.on('ding', () => {
//         console.log(chalk.dim('::: DING'));
//
//         socket.emit('dong');
//     });
//
//     socket.on('disconnect', () => {
//         if (_has(sockets, clientId)) {
//             console.log(chalk.red('[INFO] User disconnected!'));
//             sockets = _omit(sockets, clientId);
//         }
//
//         console.log(chalk.dim(`${Object.keys(sockets).length} total users connected`));
//         socket.broadcast.emit('userDisconnect', { clientId: clientId });
//     });
// });
//
// server.listen(PORT, () => {
//     console.log(chalk.green.bold(`Listening on PORT ${PORT}`));
// });
