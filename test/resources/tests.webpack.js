import 'angular';
import 'angular-mocks/angular-mocks';
import 'core-js/es5';

import sinon from 'sinon';
import 'jasmine-sinon';
import matchers       from 'jasmine-jquery-matchers';
import customMatchers from './customMatchers';

global.sinon = sinon;

let context = require.context('..', true, /\.spec\.js$/);
context.keys().forEach(context);

beforeEach(function() {
    jasmine.addMatchers(Object.assign(matchers, customMatchers));
});