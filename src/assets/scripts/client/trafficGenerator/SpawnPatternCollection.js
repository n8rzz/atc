import _forEach from 'lodash/forEach';
import _isEmpty from 'lodash/isEmpty';
import _isObject from 'lodash/isObject';
import BaseCollection from '../base/BaseCollection';
import modelSourceFactory from '../base/ModelSource/ModelSourceFactory';
import SpawnPatternModel from './SpawnPatternModel';

/**
 * A collection of `SpawnPatternModel` objects
 *
 * @class SpawnPatternCollection
 * @extends BaseCollection
 */
export default class SpawnPatternCollection extends BaseCollection {
    /**
     * @constructor
     * @for SpawnPatternCollection
     * @param airportJson {object}
     * @param navigationLibrary {NavigationLibrary}
     * @param airportController {AirportController}
     */
    constructor(airportJson, navigationLibrary, airportController) {
        super(airportJson, navigationLibrary);

        if (!_isObject(airportJson) || _isEmpty(airportJson)) {
            throw new TypeError('Invalid parameter passed to SpawnPatternCollection');
        }

        if (!_isObject(navigationLibrary) || _isEmpty(navigationLibrary)) {
            throw new TypeError('Invalid NavigationLibrary passed to SpawnPatternCollection');
        }

        if (!_isObject(airportController) || _isEmpty(airportController)) {
            throw new TypeError('Invalid AirportController passed to SpawnPatternCollection');
        }

        this.init(airportJson, navigationLibrary, airportController);
    }

    /**
     * Public property that gives access to the current value of `_items`
     *
     * @property spawnPatternModels
     * @type {array<SpawnPatternModel>}
     */
    get spawnPatternModels() {
        return this._items;
    }

    /**
     * Lifecycle method. Should be run only once on instantiation.
     *
     * Set up the instance properties
     *
     * @for SpawnPatternCollection
     * @method init
     * @param airportJson {object}
     * @param navigationLibrary {NavigationLibrary}
     * @param airportController {AirportController}
     */
    init(airportJson, navigationLibrary, airportController) {
        this._buildspawnPatternModels(airportJson.spawnPatterns, navigationLibrary, airportController);
    }

    /**
     * Loop through each item in the collection andd call `.destroy()` on that model.
     *
     * Used when resetting the collection, like onAirportChange.
     *
     * @for SpawnPatternCollection
     * @method reset
     */
    reset() {
        _forEach(this._items, (spawnPatternModel) => {
            spawnPatternModel.destroy();

            modelSourceFactory.returnModelToPool(spawnPatternModel);
        });

        this._items = [];
    }

    /**
     * @for SpawnPatternCollection
     * @method addItems
     * @param items {array}
     */
    addItems(items = []) {
        if (items.length === 0) {
            return;
        }

        for (let i = 0; i < items.length; i++) {
            const itemToAdd = items[i];

            this.addItem(itemToAdd);
        }
    }

    /**
     * @for SpawnPatternCollection
     * @method addItem
     * @param item {SpawnPatternModel}
     */
    addItem(item) {
        if (!(item instanceof SpawnPatternModel)) {
            throw new TypeError('Only SpawnPatternModel objects can be added to the SpawnPatternCollection.');
        }

        this._items.push(item);
    }

    /**
     * Loop through spawnPatterns, as defined in airport json, and create
     * a `SpawnPatternModel` for each. Then add it to the collection.
     *
     * @for SpawnPatternCollection
     * @method _buildspawnPatternModels
     * @param spawnPatterns {array<object>}
     * @param navigationLibrary {NavigationLibrary}
     * @param airportController {AirportController}
     * @private
     */
    _buildspawnPatternModels(spawnPatterns, navigationLibrary, airportController) {
        _forEach(spawnPatterns, (spawnPattern) => {
            const spawnPatternModel = modelSourceFactory.getModelSourceForType(
                'SpawnPatternModel',
                spawnPattern,
                navigationLibrary,
                airportController
            );

            this.addItem(spawnPatternModel);
        });
    }
}