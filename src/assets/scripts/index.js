/* eslint-disable */
require('raf').polyfill();
import 'babel-polyfill';
import $ from 'jquery';
import App from './App';
import io from 'socket.io-client';
import uuid from 'uuid4';

const clientId = uuid();
const socket = io({ query: `clientId=${clientId}` });

const initiateSocketWithDingDong = () => {
    socket.on('ding', () => {
        socket.emit('dong');
    });
};

/**
 * Entry point for the application.
 *
 * Provides a way to grab the `body` element of the document and pass it to the app.
 */
export default (() => {
    initiateSocketWithDingDong();

    const airportLoadList = window.AIRPORT_LOAD_LIST;
    const $body = $('body');
    const app = new App($body, airportLoadList);
})();
