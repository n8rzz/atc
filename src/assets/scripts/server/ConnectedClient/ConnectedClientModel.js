/**
 * @class connectClientModel
 */
export default class ConenctedClientModel {
    /**
     * @constructor
     * @for connectClientModel
     * @param client {object}
     */
    constructor(client) {
        /**
         *
         * @property _id
         * @type {string}
         */
        this.id = -1;

        /**
         *
         * @property clientId
         * @type {string}
         */
        this.clientId = '';

        /**
         *
         * @property ping
         * @type {number}
         */
        this.ping = -1;

        return this.init(client);
    }

    /**
     * @for connectClientModel
     * @method init
     * @param client {object}
     */
    init(client) {
        this.id = client.id;
        this.clientId = client.clientId;
        this.ping = client.ping;
    }

    /**
     * @for connectClientModel
     * @method dstroy
     * @param client {object}
     */
    destroy() {
        this.id = -1;
        this.clientId = '';
        this.ping = -1;
    }
}
