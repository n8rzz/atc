/* eslint-disable arrow-parens, max-len, import/no-extraneous-dependencies*/
import ava from 'ava';
import _isEqual from 'lodash/isEqual';

import FixCollection from '../../../src/assets/scripts/airport/Fix/FixCollection';
import FixModel from '../../../src/assets/scripts/airport/Fix/FixModel';
import { airportPositionFixture } from '../../fixtures/airportFixtures';
import {
    FIX_LIST_MOCK,
    SMALL_FIX_LIST_MOCK
} from './_mocks/fixMocks';

ava('FixCollection throws when an attempt to instantiate is made with invalid params', t => {
    t.throws(() => new FixCollection());
    t.throws(() => new FixCollection(FIX_LIST_MOCK, null));
    t.throws(() => new FixCollection(null, airportPositionFixture));

    t.notThrows(() => new FixCollection(FIX_LIST_MOCK, airportPositionFixture));
});

ava('FixCollection sets its properties when it receives a valid fixList', t => {
    const collection = new FixCollection(FIX_LIST_MOCK, airportPositionFixture);

    t.true(collection._items.length > 0);
    t.true(collection.length === collection._items.length);
});

ava('.addFixToCollection() throws if it doesnt receive a FixModel instance', t => {
    const collection = new FixCollection(FIX_LIST_MOCK, airportPositionFixture);

    t.throws(() => collection.addFixToCollection({}));
});

ava('.findFixByName() returns a FixModel if it exists within the collection', t => {
    const collection = new FixCollection(FIX_LIST_MOCK, airportPositionFixture);
    const result = collection.findFixByName('BAKRR');

    t.true(result.name === 'BAKRR');
    t.true(result instanceof FixModel);
});

ava('.findFixByName() returns a FixMode if it exists within the collection and is passed as lowercase', t => {
    const collection = new FixCollection(FIX_LIST_MOCK, airportPositionFixture);
    const result = collection.findFixByName('bakrr');

    t.true(result.name === 'BAKRR');
    t.true(result instanceof FixModel);
});

ava('.findFixByName() returns a FixMode if it exists within the collection and is passed as mixed case', t => {
    const collection = new FixCollection(FIX_LIST_MOCK, airportPositionFixture);
    const result = collection.findFixByName('bAkRr');

    t.true(result.name === 'BAKRR');
    t.true(result instanceof FixModel);
});

ava('.findFixByName() returns null if a FixModel does not exist within the collection', t => {
    const collection = new FixCollection(FIX_LIST_MOCK, airportPositionFixture);
    const result = collection.findFixByName('');

    t.true(result === null);
});

ava('.findRealFixes() returns a list of fixes that dont have `_` prepedning thier name', t => {
    const collection = new FixCollection(FIX_LIST_MOCK, airportPositionFixture);
    const result = collection.findRealFixes();

    t.true(result.length === 104);
});

ava('.getFixPositionCoordinates() returns the position of a FixModel', t => {
    const collection = new FixCollection(FIX_LIST_MOCK, airportPositionFixture);
    const result = collection.getFixPositionCoordinates('BAKRR');
    const expectedResult = [ 675.477318026648, -12.012221291734532 ];

    t.true(_isEqual(result, expectedResult));
});

ava('.getFixPositionCoordinates() returns null if a FixModel does not exist within the collection', t => {
    const collection = new FixCollection(FIX_LIST_MOCK, airportPositionFixture);
    const result = collection.getFixPositionCoordinates('');

    t.true(result === null);
});
