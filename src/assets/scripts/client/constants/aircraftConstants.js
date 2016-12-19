/**
 * @property FLIGHT_MODES
 * @type {Object}
 * @final
 */
export const FLIGHT_MODES = {
    // - 'apron' is the initial status of a new departing plane. After
    //   the plane is issued the 'taxi' command, the plane transitions to
    //   'taxi' mode
    // - 'taxi' describes the process of getting ready for takeoff. After
    //   a delay, the plane becomes ready and transitions into 'waiting' mode
    // - 'waiting': the plane is ready for takeoff and awaits clearence to
    //   take off
    // - 'takeoff' is assigned to planes in the process of taking off. These
    //   planes are still on the ground or have not yet reached the minimum
    //   altitude
    // - 'cruse' describes, that a plane is currently in flight and
    //   not following an ILS path. Planes of category 'arrival' entering the
    //   playing field also have this state. If an ILS path is picked up, the
    //   plane transitions to 'landing'
    // - 'landing' the plane is following an ILS path or is on the runway in
    //   the process of stopping. If an ILS approach or a landing is aborted,
    //   the plane reenters 'cruise' mode
    APRON: 'apron',
    TAXI: 'taxi',
    WAITING: 'waiting',
    TAKEOFF: 'takeoff',
    CRUISE: 'cruise',
    LANDING: 'landing'
};

/**
 * @property FLIGHT_CATEGORY
 * @type {Object}
 * @final
 */
export const FLIGHT_CATEGORY = {
    ARRIVAL: 'arrival',
    DEPARTURE: 'departure'
};

/**
 * @property WAYPOINT_NAV_MODE
 * @type {Object}
 * @final
 */
export const WAYPOINT_NAV_MODE = {
    FIX: 'fix',
    HEADING: 'heading',
    HOLD: 'hold',
    RWY: 'rwy'
};

/**
 * Enumeration of possible FLight Plan Leg types.
 *
 * @property FP_LEG_TYPE
 * @type {Object}
 * @final
 */
export const FP_LEG_TYPE = {
    SID: 'sid',
    STAR: 'star',
    IAP: 'iap',
    AWY: 'awy',
    FIX: 'fix',
    MANUAL: '[manual]'
};
