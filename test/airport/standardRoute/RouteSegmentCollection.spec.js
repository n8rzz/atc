/* eslint-disable arrow-parens, import/no-extraneous-dependencies*/
import ava from 'ava';
import _isEqual from 'lodash/isEqual';

import RouteSegmentCollection from '../../../src/assets/scripts/client/airport/StandardRoute/RouteSegmentCollection';
import RouteSegmentModel from '../../../src/assets/scripts/client/airport/StandardRoute/RouteSegmentModel';
import FixCollection from '../../../src/assets/scripts/client/airport/Fix/FixCollection';

import { airportPositionFixtureKSFO } from '../../fixtures/airportFixtures';
import { FIX_LIST_MOCK } from '../fix/_mocks/fixMocks';
import { ROUTE_SEGMENTS_MOCK } from './_mocks/standardRouteMocks';

ava.before(() => FixCollection.addItems(FIX_LIST_MOCK, airportPositionFixtureKSFO));
ava.after(() => FixCollection.removeItems());

ava('throws with invalid parameters', t => {
    t.throws(() => new RouteSegmentCollection());
    t.throws(() => new RouteSegmentCollection([]));
    t.throws(() => new RouteSegmentCollection(''));
    t.throws(() => new RouteSegmentCollection(null));
    t.throws(() => new RouteSegmentCollection(undefined));
    t.throws(() => new RouteSegmentCollection(42));
    t.throws(() => new RouteSegmentCollection(false));
});

ava('accepts routeSegments as a parameter and sets its properties', t => {
    const expectedResultListLength = 8;
    const collection = new RouteSegmentCollection(ROUTE_SEGMENTS_MOCK);

    t.notThrows(() => new RouteSegmentCollection(ROUTE_SEGMENTS_MOCK));
    t.true(collection.length === expectedResultListLength);
    t.true(collection._items.length === expectedResultListLength);
});

ava('.findSegmentByName() returns a SegmentModel of a segment within the collection', t => {
    const SEGMENT_NAME = '25L';
    const collection = new RouteSegmentCollection(ROUTE_SEGMENTS_MOCK);
    const result = collection.findSegmentByName(SEGMENT_NAME);

    t.true(result.name === SEGMENT_NAME);
    t.true(result instanceof RouteSegmentModel);
});

ava('.findSegmentByName() returns undefined if a segment name cannot be found', t => {
    const SEGMENT_NAME = 'SUDZ';
    const collection = new RouteSegmentCollection(ROUTE_SEGMENTS_MOCK);
    const result = collection.findSegmentByName(SEGMENT_NAME);

    t.notThrows(() => collection.findSegmentByName(SEGMENT_NAME));
    t.true(typeof result === 'undefined');
});

ava('.findWaypointsForSegmentName() returns an array of fixes for a given segment name', t => {
    const SEGMENT_NAME = '25L';
    const collection = new RouteSegmentCollection(ROUTE_SEGMENTS_MOCK);
    const result = collection.findWaypointsForSegmentName(SEGMENT_NAME);

    t.true(result.length === ROUTE_SEGMENTS_MOCK[SEGMENT_NAME].length);
    t.true(_isEqual(result[0], ['PIRMD', null]), 'Expected to receive and array that is [`{string}`, `{string|null}`]');
});

ava('.gatherFixNamesForCollection() returns a list of names for each RouteSegmentModel in the collection', t => {
    const collection = new RouteSegmentCollection(ROUTE_SEGMENTS_MOCK);
    const result = collection.gatherFixNamesForCollection();

    t.true(result.length === 8);
});

ava('._addSegmentToCollection() throws if not passed a RouteSegmentModel', t => {
    const collection = new RouteSegmentCollection(ROUTE_SEGMENTS_MOCK);

    t.throws(() => collection._addSegmentToCollection({}));
});
