import _map from 'lodash/map';
import _isArray from 'lodash/isArray';
import _uniqId from 'lodash/uniqueId';
import StandardRouteWaypointModel from './StandardRouteWaypointModel';

/**
 * Provides an interface for dealing with a list of `StandardRouteWaypointModel`s that make up a given route segment.
 *
 * @class RouteSegmentModel
 */
export default class RouteSegmentModel {
    /**
     * segmentWaypoints should come in a similar shape to:
     * - ["_NAPSE068", "NAPSE", ["RIOOS", "A130+"], "COMPS"]
     *
     * @constructor
     * @param name {string}  Icao of particular waypoint
     * @param segmentWaypoints {array}  a mixed array of strings or arrays of strings
     */
    constructor(name, segmentWaypoints = []) {
        /**
         * Unigue string id that can be used to differentiate this model instance from another
         *
         * @property _id
         * @type {string}
         * @private
         */
        this._id = _uniqId();

        /**
         * Name of the RouteSegment
         *
         * @property name
         * @type {string}
         * @default ''
         * @private
         */
        this.name = '';

        /**
         * `StandardRouteWaypointModel`s that make up the RouteSegment
         *
         * @property _items
         * @type {array}
         * @default []
         * @private
         */
        this._items = [];

        /**
         * Convenience property to get at the current length of `_items`.
         *
         * If a remove method is every added, this property will need to be updated in addition
         * to any changes that need to happen within the collection.
         *
         * @property length
         * @type {number}
         * @default -1
         * @private
         */
        this.length = -1;

        return this._init(name, segmentWaypoints);
    }

    /**
     * Lifecycle method. Should be run only once on instantiation.
     *
     * @for RouteSegmentModel
     * @method _init
     * @param name {string}
     * @param segmentWaypoints {array}
     * @private
     */
    _init(name, segmentWaypoints) {
        this.name = name;

        if (_isArray(segmentWaypoints)) {
            this._createWaypointModelsFromList(segmentWaypoints);
        }

        return this;
    }

    /**
     * Destroy the current model instance
     *
     * @for destroy
     * @method destroy
     */
    destroy() {
        this._id = '';
        this.name = '';
        this._items = [];
        this.length = -1;

        return this;
    }

    /**
     * Return a list of fixes for the RouteSegment.
     *
     * This will return a normalized list of fixes, ex:
     * - [FIXNAME, null]
     * - [FIXNAME, RESTRICTIONS]
     *
     * @for RouteSegmentModel
     * @method findWaypointsForSegment
     * @return fixList {array}
     */
    findWaypointsForSegment() {
        const fixList = _map(this._items, (waypoint) => waypoint.fix);

        return fixList;
    }


    _createWaypointModelsFromList(segmentWaypoints) {
        const waypointModelList = _map(segmentWaypoints, (fixAndRestrictions) => {
            const waypointModel = new StandardRouteWaypointModel(fixAndRestrictions);

            this._addWaypointToCollection(waypointModel);
        });

        return waypointModelList;
    }

    /**
     * Add a new model to the collection and update length.
     *
     * @for RouteSegmentModel
     * @method _addWaypointToCollection
     * @param waypoint {StandardRouteWaypointModel}
     * @private
     */
    _addWaypointToCollection(waypoint) {
        if (!(waypoint instanceof StandardRouteWaypointModel)) {
            throw new TypeError(`Expected waypoint to be an instance of StandardRouteWaypointModel, instead received ${waypoint}.`);
        }

        this._items.push(waypoint);
        this.length = this._items.length;
    }
}
