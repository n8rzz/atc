/**
 * Root commands defined in the `commandMap` have a matching definition defined here. This definition
 * give us access to vaildate and parse functions. Some commands don't require either function and simply
 * pass the arguments through via `noop`. Other commands commands have very unique demands for how
 * arguments are formatted, these functions let us validate and parse on a case by case basis.
 *
 * Keys are lowercased here so they can be accessed programatically using input string segments
 * that are converted to lowercase for ease of comparison.
 *
 * @fileoverview
 */
import {
    convertToThousands,
    convertStringToNumber
} from '../utilities/unitConverters';
import {
    zeroArgumentsValidator,
    singleArgumentValidator,
    zeroOrOneArgumentValidator,
    altitudeValidator,
    fixValidator,
    headingValidator,
    holdValidator
} from './argumentValidators';
import {
    altitudeParser,
    headingParser,
    holdParser
} from './argumentParsers';

/**
 * A no-op function used for command definitions that do not need a parser
 *
 * This function will immediately return any arguments passed to it and is
 * used in place of an actual parser. this way `command.parse` can still
 * be called even with commands that don't need to be parsed.
 *
 * @function noop
 * @param args {*}
 * @return {*}
 */
const noop = (args) => args;

/**
 * System and Aircraft command definitions that accept zero arguments
 *
 * @property ZERO_ARG_COMMANDS
 * @type {Object}
 * @final
 */
const ZERO_ARG_COMMANDS = {
    // system commands
    auto: {
        validate: zeroArgumentsValidator,
        parse: noop
    },
    clear: {
        validate: zeroArgumentsValidator,
        parse: noop
    },
    pause: {
        validate: zeroArgumentsValidator,
        parse: noop
    },
    tutorial: {
        validate: zeroArgumentsValidator,
        parse: noop
    },
    version: {
        validate: zeroArgumentsValidator,
        parse: noop
    },

    // Aircraft commands
    abort: {
        validate: zeroArgumentsValidator,
        parse: noop
    },
    clearedAsFiled: {
        validate: zeroArgumentsValidator,
        parse: noop
    },
    climbViaSID: {
        validate: zeroArgumentsValidator,
        parse: noop
    },
    debug: {
        validate: zeroArgumentsValidator,
        parse: noop
    },
    delete: {
        validate: zeroArgumentsValidator,
        parse: noop
    },
    descendViaSTAR: {
        validate: zeroArgumentsValidator,
        parse: noop
    },
    flyPresentHeading: {
        validate: zeroArgumentsValidator,
        parse: noop
    },
    sayRoute: {
        validate: zeroArgumentsValidator,
        parse: noop
    },
    takeoff: {
        validate: zeroArgumentsValidator,
        parse: noop
    }
};

/**
 * System and Aircraft commands that accept a single argument
 *
 * these commands accept a single argument and may require further parsing, eg: (string -> number)
 *
 * @property SINGLE_ARG_COMMANDS
 * @type {Object}
 * @final
 */
const SINGLE_ARG_COMMANDS = {
    '`': {
        validate: singleArgumentValidator,
        // calling method is expecting an array with values that will get spread later, thus we purposly
        // return an array here
        parse: (args) => [convertStringToNumber(args)]
    },
    airport: {
        validate: singleArgumentValidator,
        parse: noop
    },
    rate: {
        validate: singleArgumentValidator,
        // calling method is expecting an array with values that will get spread later, thus we purposly
        // return an array here
        parse: (args) => [convertStringToNumber(args)]
    },
    timewarp: {
        validate: singleArgumentValidator,
        // calling method is expecting an array with values that will get spread later, thus we purposly
        // return an array here
        parse: (args) => [convertStringToNumber(args)]
    },

    direct: {
        validate: singleArgumentValidator,
        parse: noop
    },
    land: {
        validate: singleArgumentValidator,
        // TODO: split this out to custom parser once the null value is defined
        parse: (args) => [null, args[0]]
    },
    moveDataBlock: {
        validate: singleArgumentValidator,
        parse: noop
    },
    route: {
        validate: singleArgumentValidator,
        parse: noop
    },
    reroute: {
        validate: singleArgumentValidator,
        parse: noop
    },
    sid: {
        validate: singleArgumentValidator,
        parse: noop
    },
    speed: {
        validate: singleArgumentValidator,
        // calling method is expecting an array with values that will get spread later, thus we purposly
        // return an array here
        parse: (arg) => [convertStringToNumber(arg)]
    },
    star: {
        validate: singleArgumentValidator,
        parse: noop
    }
};

/**
 * System and Aircraft commands that accept arguments specific to the command
 *
 * These definitions will likely reference functions for validate and parse that are specific only
 * to one command
 *
 * @property CUSTOM_ARG_COMMANDS
 * @type {Object}
 * @final
 */
const CUSTOM_ARG_COMMANDS = {
    taxi: {
        validate: zeroOrOneArgumentValidator,
        parse: noop
    },

    // these commands have specific argument requirements and may need to be parsed
    // into the correct type (sting -> number)
    altitude: {
        validate: altitudeValidator,
        parse: altitudeParser
    },
    fix: {
        validate: fixValidator,
        parse: noop
    },
    heading: {
        validate: headingValidator,
        parse: headingParser
    },
    hold: {
        validate: holdValidator,
        parse: holdParser
    }
};

/**
 * Single exported constant that combines all the definitions above
 *
 * @property COMMAND_DEFINITION
 * @type {Object}
 * @final
 */
export const COMMAND_DEFINITION = {
    ...ZERO_ARG_COMMANDS,
    ...SINGLE_ARG_COMMANDS,
    ...CUSTOM_ARG_COMMANDS
};
