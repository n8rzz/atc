import { EVENTS } from '../../server/socketEventNames';

/**
 *
 *
 * @class ConnectionController
 */
export default class ConnectionController {
    /**
     * @constructor
     * @for ConnectionController
     * @param socket {SocketIO}
     */
    constructor(socket) {
        /**
         * @property socket
         * @type {SocketIO}
         * @default socket
         */
        this.socket = socket;

        this._commandReceivedHandler = () => {};

        return this.init()
                   .setupHandlers();
    }

    /**
     * @for ConnectionController
     * @method init
     * @chainable
     */
    init() {
        return this;
    }

    /**
     * @for ConnectionController
     * @method setupHandlers
     * @chainable
     */
    setupHandlers() {
        this.initiateConnection();

        this.socket.on(EVENTS.COMMAND_RECEIVED, this._onCommandReceivedHandler);

        return this;
    }

    /**
     * @for ConnectionController
     * @method initiateConnection
     */
    initiateConnection() {
        this.socket.on('ding', () => {
            this.socket.emit('dong');
        });
    }


    sendCommand(command) {
        this.socket.emit(EVENTS.COMMAND_ISSUED, { command: command });
    }

    registerCommandReceivedHandler(handler) {
        this._commandReceivedHandler = handler;
    }

    _onCommandReceivedHandler = (command) => {
        console.log('_onCommandReceivedHandler', command);

        this._commandReceivedHandler(command);
    };
}
