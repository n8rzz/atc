import { COMMAND_DEFINITION } from './commandDefinitions';

/**
 * A definition of a specific command and it's arguments.
 *
 * Conatins a command name, which maps 1:1 with a name defined in `commandMap.js` and `commandDefinitions.js`.
 * Commands may have an alias or many, we care only about the root command. The command map will map any
 * alias to a root command and this `CommandModel` is only concerned about those root commands. It has
 * no way of knowing what the original alias was, if one was used.
 *
 * Each `CommandModel` will be expected to have, at a minimum, a `name` and a matching `COMMAND_DEFINITION`.
 *
 * @class CommandModel
 */
export default class CommandModel {
    /**
     * @constructor
     * @for CommandModel
     */
    constructor(name = '') {
        /**
         * command name, should match a command in the COMMANDS constant
         *
         * @property name
         * @type {string}
         */
        this.name = name;

        /**
         * A reference to the COMMAND_DEFINITION for this particular command.
         * this gives us access to both the `validate` and `parse` methods
         * that belong to this command.
         *
         * Storing this as a class property allows us to do the lookup once
         * and then make it available to the rest of the class so it can
         * be referenced when needed.
         *
         * @property _commandDefinition
         * @type {object}
         * @private
         */
        this._commandDefinition = COMMAND_DEFINITION[name];

        /**
         * list of command arguments
         *
         * - assumed to be the text command names
         * - may be empty, depending on the command
         * - should only ever be strings on initial set immediately after instantiation
         * - will later be parsed via the `_commandDefinition.parse()` method to the
         *   correct data types and shape
         *
         * @property args
         * @type {array}
         * @default []
         */
        this.args = [];

        // TODO: may need to throw here if `_commandDefinition` is undefined
    }

    /**
     * Return an array of [name, ...args]
     *
     * We use this shape solely to match the existing api.
     *
     * @property nameAndArgs
     * @return {array}
     */
    get nameAndArgs() {
        return [
            this.name,
            ...this.args
        ];
    }

    /**
     * Send the initial args off to the validator
     *
     * @for CommandModel
     * @method validateArgs
     * @return {string|undefined}
     */
    validateArgs() {
        return this._commandDefinition.validate(this.args);
    }

    /**
     * Send the initial args, set from the `CommandParser` right after instantiation, off to
     * the parser for formatting.
     *
     * @for CommandModel
     * @method parseArgs
     */
    parseArgs() {
        // this completely overwrites current args. this is intended because all args are received as
        // strings but consumed as strings, numbers or booleans. and when the args are initially set
        // they may not all be available yet
        this.args = this._commandDefinition.parse(this.args);
    }
}
