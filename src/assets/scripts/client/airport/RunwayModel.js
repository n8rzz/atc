import _includes from 'lodash/includes';
import _without from 'lodash/without';
import BaseModel from '../base/BaseModel';
import PositionModel from '../base/PositionModel';
import { abs, tan } from '../math/core';
import { radians_normalize } from '../math/circle';
import { km, degreesToRadians } from '../utilities/unitConverters';
import { vlen, vradial, vsub, vadd, vscale } from '../math/vector';

/**
 * @class RunwayModel
 */
export default class RunwayModel extends BaseModel {
    /**
     * @for RunwayModel
     * @constructor
     * @param options {object}
     * @param end
     * @param airport {AirportModel}
     */
    constructor(options = {}, end, airport) {
        super();

        options.airport = airport;
        this.airport = null;
        this.angle = null;
        this.elevation = 0;
        this.delay = 2;
        this.gps = [];
        this.ils = {
            // TODO: what do these numbers mean? enumerate the magic numbers
            enabled: true,
            loc_maxDist: km(25),
            gs_maxHeight: 9999,
            gs_gradient: degreesToRadians(3)
        };
        this.labelPos = [];
        this.length = null;
        this.midfield = [];
        this.name = '';
        this.position = [];
        this.queue = [];
        this.sepFromAdjacent = km(3);

        this.parse(options, end);
    }

    /**
     * @for RunwayModel
     * @method parse
     * @param data
     * @param end
     */
    parse(data, end) {
        this.airport = data.airport;

        if (data.delay) {
            this.delay = data.delay[end];
        }

        if (data.end) {
            const thisSide = new PositionModel(data.end[end], data.reference_position, data.magnetic_north);
            // FIXME: ressignment of an argument with an inline ternary? this line needs some work.
            const farSide = new PositionModel(data.end[(end === 0) ? 1 : 0], data.reference_position, data.magnetic_north);

            // TODO: `gps` and `elevation` are available from the `PositionModel` and should be pulled from there
            // instead of setting direct properties. If direct properties are needed, use getters isntead.
            // GPS latitude and longitude position
            this.gps = [thisSide.latitude, thisSide.longitude];

            if (thisSide.elevation != null) {
                this.elevation = thisSide.elevation;
            }

            if ((this.elevation === 0) && (this.airport.elevation !== 0)) {
                this.elevation = this.airport.elevation;
            }

            // relative position, based on center of map
            this.position = thisSide.position;
            this.length = vlen(vsub(farSide.position, thisSide.position));
            // TODO: what is the 0.5 for? enumerate the magic number
            this.midfield = vscale(vadd(thisSide.position, farSide.position), 0.5);
            this.angle = radians_normalize(vradial(vsub(farSide.position, thisSide.position)));
        }

        if (data.ils) {
            this.ils.enabled = data.ils[end];
        }

        if (data.ils_distance) {
            this.ils.loc_maxDist = km(data.ils_distance[end]);
        }

        if (data.ils_gs_maxHeight) {
            this.ils.gs_maxHeight = data.ils_gs_maxHeight[end];
        }

        if (data.glideslope) {
            this.ils.gs_gradient = degreesToRadians(data.glideslope[end]);
        }

        if (data.name_offset) {
            this.labelPos = data.name_offset[end];
        }

        if (data.name) {
            this.name = data.name[end];
        }

        if (data.sepFromAdjacent) {
            this.sepFromAdjacent = km(data.sepFromAdjacent[end]);
        }
    }

    /**
     * Adds the specified aircraft to the runway queue
     *
     * @for RunwayModel
     * @method addAircraftToQueue
     * @param {Aircraft}
     */
    addAircraftToQueue(aircraft) {
        this.queue.push(aircraft);
    }

    /**
     * Removes the specified aircraft from the runway queue
     *
     * @for RunwayModel
     * @method removeQueue
     * @param  {Aircraft}
     * @return {Boolean}
     */
    removeQueue(aircraft) {
        if (_includes(this.queue, aircraft)) {
            this.queue = _without(this.queue, aircraft);

            return true;
        }
    }

    /**
    * Calculate the height of the glideslope for a runway's ILS at a given distance on final
    *
    * @for RunwayModel
    * @method getGlideslopeAltitude
    * @param {Number} distance - the distance from the runway threshold, in (units???)
    * @param {Number} gs_gradient - the gradient of the glideslope, in degrees (typically 3.0)
    */
    getGlideslopeAltitude(distance, /* optional */ gs_gradient) {
        if (!gs_gradient) {
            gs_gradient = this.ils.gs_gradient;
        }

        distance = Math.max(0, distance);
        const rise = tan(abs(gs_gradient));

        // TODO: this logic could be abstracted to a helper.
        // TODO: what does 3280 mean? enumerate the magic number
        return this.elevation + (rise * distance * 3280);
    }

    /**
     *
     *
     * @for RunwayModel
     * @method isAircraftInQueue
     * @param {Aircraft}
     */
    isAircraftInQueue(aircraft) {
        return this.positionOfAircraftInQueue(aircraft) !== -1;
    }

    /**
     * Returns whether the specified aircraft is the first still waiting for takeoff clearance
     *
     * @for RunwayModel
     * @method isAircraftNextInQueue
     * @param  {Aircraft}
     * @return {Boolean}
     */
    isAircraftNextInQueue(aircraft) {
        return this.positionOfAircraftInQueue(aircraft) === 0;
    }

    /**
     * Remove the specified aircraft from the runway queue
     *
     * @for RunwayModel
     * @method removeAircraftFromQueue
     * @param {Aircraft}
     */
    removeAircraftFromQueue(aircraft) {
        this.queue = _without(this.queue, aircraft);
    }

    /**
     * Returns the position of a specified aircraft in the runway's queue
     *
     * @for RunwayModel
     * @method positionOfAircraftInQueue
     * @param  {Aircraft}
     * @return {Number}
     */
    positionOfAircraftInQueue(aircraft) {
        return this.queue.indexOf(aircraft);
    }
}
