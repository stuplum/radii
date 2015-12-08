import 'angular';
import 'angular-mocks/angular-mocks';
import 'core-js/es5';

import sinon from 'sinon';
import 'jasmine-sinon';

global.sinon = sinon;

let context = require.context('..', true, /\.spec\.js$/);
context.keys().forEach(context);
