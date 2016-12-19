import { digits_integer } from '../utilities/radioUtilities';
import { SELECTORS } from '../constants/selectors';
import { TIME } from '../constants/globalConstants';

/**
 * Manages a clock that stays in sync with the current game time
 * @class GameClockView
 */
export default class GameClockView {
    /**
     * @for GameClockView
     * @constructor
     */
    constructor($element) {
        this.$element = $element;
        this.startTime = 0;
        this.time = 0;

        return this._init($element);
    }

    /**
    * Get current time in the user's time zone
    * @for GameClockView
    * @property realWorldCurrentLocalTime
    * @return {number} ms since 01/01/1970, 00:00:00 (user's time zone)
    */
    get realWorldCurrentLocalTime() {
        return new Date().getTime();
    }

    /**
    * Get current zulu time in milliseconds
    * @for GameClockView
    * @property realWorldCurrentZuluTime
    * @return utc {number} ms since 01/01/1970, 00:00:00 UTC
    */
    get realWorldCurrentZuluTime() {
        const date = new Date();
        const utc = date.getTime() + (date.getTimezoneOffset() * TIME.ONE_MINUTE_IN_MILLISECONDS);

        return utc;
    }

    /**
    * @for GameClockView
    * @method destroy
    * @chainable
    */
    destroy() {
        this.$element = null;
        this.startTime = 0;
        this.time = 0;

        return this;
    }

    /**
    * Generates a string of the current game time in a human-readable format
    * @for GameClockView
    * @property timeString
    * @return clockTime {string} current game time formatted like '03:44:17'
    */
    generateCurrentTimeString() {
        const gameTime = window.gameController.game.time;
        const clockDate = new Date(this.startTime + (gameTime * TIME.ONE_SECOND_IN_MILLISECONDS));
        const hours = digits_integer(clockDate.getHours(), 2);
        const minutes = digits_integer(clockDate.getMinutes(), 2);
        const seconds = digits_integer(clockDate.getSeconds(), 2);
        const clockTime = `${hours}:${minutes}:${seconds}`;

        return clockTime;
    }

    /**
    * Updates the stored time and displayed time in webpage
    * @for GameClockView
    * @method update
    */
    update() {
        this._tick();
        this._render();
    }

    /**
    * @for GameClockView
    * @method _init
    * @private
    */
    _init($element) {
        this.$element = $element.find(SELECTORS.DOM_SELECTORS.CLOCK);
        this.$element.addClass(SELECTORS.CLASSNAMES.NOT_SELECTABLE);
        this.startTime = this.realWorldCurrentZuluTime;

        return this;
    }

    /**
    * Updates the DOM with the new game time
    * @for GameClockView
    * @method _render
    * @private
    */
    _render() {
        this.$element.text(this.generateCurrentTimeString());
    }

    /**
    * Updates the time stored in the clock
    * @for GameClockView
    * @method _tick
    * @private
    */
    _tick() {
        const elapsedTime = window.gameController.game.time * TIME.ONE_SECOND_IN_MILLISECONDS;
        this.time = this.startTime + elapsedTime;
    }
}
