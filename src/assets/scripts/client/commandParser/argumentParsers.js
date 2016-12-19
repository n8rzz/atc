import { isValidDirectionString } from './argumentValidators';
import {
    convertToThousands,
    convertStringToNumber
} from '../utilities/unitConverters';

/**
 * Enumeration of possible the hold command argument names.
 *
 * Enumerated here base these nanes are shared accross several functions and this
 * provides a single source of truth.
 *
 * @property HOLD_COMMAND_ARG_NAMES
 * @type {Object}
 * @final
 */
const HOLD_COMMAND_ARG_NAMES = {
    TURN_DIRECTION: 'turnDirection',
    LEG_LENGTH: 'legLength',
    FIX_NAME: 'fixName'
};

/**
 * Converts a flight level altitude to a number in thousands and converts second arg to a boolean
 *
 * @function altitudeParser
 * @param args {array}
 * @return {array<number, boolean>}
 */
export const altitudeParser = (args) => {
    const altitude = convertToThousands(args[0]);
    // the validator will have already caught an invalid value here. if one exists, it is assumed to be valid and
    // thus we return true. otherwise its false
    const shouldExpedite = typeof args[1] !== 'undefined';

    return [altitude, shouldExpedite];
};

/**
 * Accepts a direction string:
 * - `left / l / right / r`
 *
 * and returns `left / right`
 *
 * @function directionNormalizer
 * @param direction {string}
 * @return normalizedDirection {string}
 */
const directionNormalizer = (direction) => {
    let normalizedDirection = direction;

    if (direction === 'l') {
        normalizedDirection = 'left';
    } else if (direction === 'r') {
        normalizedDirection = 'right';
    }

    return normalizedDirection;
};

/**
 * Returns a consistent array with the same shape no matter the number of arguments received
 *
 * Converts a flight level altitude to a number in thousands and converts second arg to a boolean
 *
 * @function headingParser
 * @param args {array}
 * @return {array<string, number, boolean>}
 */
export const headingParser = (args) => {
    let direction;
    let heading;
    let isIncremental = false;

    switch (args.length) {
        case 1:
            // existing api is expeting undefined values to be exactly null
            direction = null;
            heading = convertStringToNumber(args[0]);

            return [direction, heading, isIncremental];
        case 2:
            isIncremental = args[1].length === 2;
            direction = directionNormalizer(args[0]);
            heading = convertStringToNumber(args[1]);

            return [direction, heading, isIncremental];
        default:
            throw new Error('An error ocurred parsing the Heading arguments');
    }
};

/**
 * Abstracted boolean logic used to detmine if a string contains `min` or `nm`.
 *
 * This is useful specifically with the `findHoldCommandByType`.
 *
 * @function isLegLengthArg
 * @param arg {string}
 * @return {boolean}
 */
const isLegLengthArg = (arg) => arg.indexOf('min') !== -1 || arg.indexOf('nm') !== -1;

/**
 * Given a type and an argument list, find the first occurance of `type` from within the argument list.
 *
 * We are looking for one of three things here:
 * - `turnDirection` - a variation of left or right
 * - `legLength` - length of hold leg in either minutes (min) or nautical miles (nm)
 * - `fixName` - assumed to be a string that isn't a `turnDirection` or `legLength`. The parser has no way of
 *               knowing if a certain string is an actual `fixName`. We can only determine that it isn't a
 *               `turnDirection` or `legLength`. This will error from within the `runHold` method if the
 *               `fixName` is not valid.
 *
 * @function findHoldCommandByType
 * @param type {HOLD_COMMAND_ARG_NAMES}
 * @param args {array}
 * @return {string|null}
 */
export const findHoldCommandByType = (type, args) => {
    for (let i = 0; i < args.length; i++) {
        const arg = args[i];

        switch (type) {
            case HOLD_COMMAND_ARG_NAMES.TURN_DIRECTION:
                if (!isValidDirectionString(arg)) {
                    continue;
                }

                return directionNormalizer(arg);
            case HOLD_COMMAND_ARG_NAMES.LEG_LENGTH:
                if (!isLegLengthArg(arg)) {
                    continue;
                }

                return arg;
            case HOLD_COMMAND_ARG_NAMES.FIX_NAME:
                if (isValidDirectionString(arg) || isLegLengthArg(arg)) {
                    continue;
                }

                return arg;
            default:
                return null;
        }
    }

    return null;
};

/**
 * The `hold` command accepts arguments in any order thus, we use the `findHoldCommandByType` helper
 * method to do that for us. This provides an easy way tp find the correct argument, no matter the order,
 * and consistently return an array of the same shape.
 *
 * @function holdParser
 * @param args {array}
 * @return {array<string>}
 */
export const holdParser = (args) => {
    // existing api is expeting undefined values to be exactly null
    const fixName = findHoldCommandByType(HOLD_COMMAND_ARG_NAMES.FIX_NAME, args);
    const turnDirection = findHoldCommandByType(HOLD_COMMAND_ARG_NAMES.TURN_DIRECTION, args);
    const legLength = findHoldCommandByType(HOLD_COMMAND_ARG_NAMES.LEG_LENGTH, args);

    return [turnDirection, legLength, fixName];
};
