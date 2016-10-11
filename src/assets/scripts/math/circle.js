import { mod } from './core';
import { radiansToDegrees, degreesToRadians } from '../utilities/unitConverters';

/**
 * 2x Pi
 *
 * @function tau
 * @return {number}
 */
export const tau = () => {
    return Math.PI * 2;
};

/**
 * Returns the angle difference between two headings
 *
 * @function angle_offset
 * @param {number} a     heading, in radians
 * @param {number} b     heading, in radians
 * @return {number}
 */
export const angle_offset = (a, b) => {
    a = radiansToDegrees(a);
    b = radiansToDegrees(b);
    let invert = false;

    if (b > a) {
        invert = true;
        const temp = a;

        a = b;
        b = temp;
    }

    let offset = mod(a - b, 360);
    if (offset > 180) {
        offset -= 360;
    }

    if (invert) {
        offset *= -1;
    }

    offset = degreesToRadians(offset);

    return offset;
};

/**
 * Constrains an angle to within 0 --> Math.PI * 2
 *
 * @function fix_angle
 * @param radians {number}
 * @return {number}
 */
export const fix_angle = (radians) => {
    while (radians > tau()) {
        radians -= tau();
    }

    while (radians < 0) {
        radians += tau();
    }

    return radians;
};

/**
 * normalize angles to within 0° - 360°
 * @param  {number} degrees an angle
 * @return {number}         an angle within [0,360]
 */
export const degrees_normalize = (degrees) => {
    if (degrees < 0) {
        return 360 + (degrees % 360);
    }
    else return degrees % 360;
};

/**
 * normalize angles to within 0 - 2π
 * @param  {number} radians an angle
 * @return {number}         an angle within [0,2π]
 */
export const radians_normalize = (radians) => {
    if (radians < 0) {
        return (Math.PI*2) + (radians % (Math.PI*2));
    }
    else return radians % (Math.PI*2);
};
