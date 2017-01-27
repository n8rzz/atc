'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)();
var server = _http2.default.Server(app);

var PORT = process.env.PORT || 3003;

app.use('/assets', _express2.default.static(_path2.default.join(__dirname, '/../../../assets')));

app.get('/', function (req, res) {
    res.sendFile(_path2.default.join(__dirname, '/../../../index.html'));
});

server.listen(PORT, function () {
    console.log(_chalk2.default.green.bold('Listening on PORT ' + PORT));
});