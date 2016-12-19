import _find from 'lodash/find';
import _forEach from 'lodash/forEach';
import _isArray from 'lodash/isArray';
import _isObject from 'lodash/isObject';
import _map from 'lodash/map';
import BaseCollection from '../../base/BaseCollection';
import RouteSegmentModel from './RouteSegmentModel';

/**
 * A collection of `RouteSegment`s.
 *
 * Provide a way to deal with the various parts of a `StandardProcedureRoute` as defined in each
 * airport json file.
 *
 * Each SID is broken up into three route segments:
 * - `rwy` (optional)
 * - `body`
 * - `exitPoints` (optional)
 *
 * Each STAR is broken up into three route segments:
 * - `entryPoints` (optional)
 * - `body`
 * - `rwy` (optional)
 *
 * This collection is meant to contain the waypoints for a single route segment and can be
 * used to resaon about the route as a single unit.
 *
 * @class RouteSegmentCollection
 */
export default class RouteSegmentCollection extends BaseCollection {
    /**
     * @constructor
     * @param routeSegments {object}
     */
    /* istanbul ignore next */
    constructor(routeSegments) {
        super();

        if (typeof routeSegments === 'undefined' || !_isObject(routeSegments) || _isArray(routeSegments)) {
            throw new TypeError(`Expected routeSegments to be an object. Instead received ${typeof routeSegments}`);
        }

        /**
         * Name of the RouteSegment
         *
         * @property name
         * @type {string}
         * @default ''
         */
        this.name = '';

        return this._init(routeSegments);
    }

    /**
     * Provide access to the contents of `_items`
     *
     * @property items
     * @return {array}
     */
    get items() {
        return this._items;
    }

    /**
     * Lifecycle method. Should be run only once on instantiation.
     *
     * @for RouteSegmentCollection
     * @method _init
     * @param routeSegments {object}
     * @chainable
     * @private
     */
    _init(routeSegments) {
        _forEach(routeSegments, (routeWaypoints, key) => {
            const routeSegmentModel = new RouteSegmentModel(key, routeWaypoints);

            this._addSegmentToCollection(routeSegmentModel);
        });

        return this;
    }

    /**
     * Destroy the current instance
     *
     * @for RouteSegmentCollection
     * @method destroy
     * @chainable
     */
    destroy() {
        this._id = '';
        this.name = '';
        this._items = [];

        return this;
    }

    /**
     * Find a `RouteSegmentModel` within the collection by its name
     *
     * @for RouteSegmentCollection
     * @method findSegmentByName
     * @param segmentName {string}
     * @return {SegmentModel}
     */
    findSegmentByName(segmentName) {
        return _find(this._items, { name: segmentName.toUpperCase() });
    }

    /**
     * Find a list of waypoints for a given `segmentName`
     *
     * @for RouteSegmentCollection
     * @method findWaypointsForSegmentName
     * @param segmentName {string}
     * @return {array}
     */
    findWaypointsForSegmentName(segmentName) {
        const segment = this.findSegmentByName(segmentName);

        return segment.findWaypointsForSegment();
    }

    /**
     * Return a list of fixNames for all of the `RouteSegmentModel`s in the collection
     *
     * @for RouteSegmentCollection
     * @method gatherFixNamesForCollection
     * @return {array}
     */
    gatherFixNamesForCollection() {
        return _map(this._items, (item) => item.name);
    }

    /**
     * Add a new segment to the collection
     *
     * @for RouteSegmentCollection
     * @method _addSegmentToCollection
     * @param segment {SegmentModel}
     * @chainable
     * @private
     */
    _addSegmentToCollection(segment) {
        if (!(segment instanceof RouteSegmentModel)) {
            // eslint-disable-next-line max-len
            throw new TypeError(`Expected segment to be an instance of RouteSegmentModel, instead received ${segment}.`);
        }

        this._items.push(segment);

        return this;
    }
}
