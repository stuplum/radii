'use strict';

import radii from '../lib/radii';

describe('mockModule', function () {

    beforeEach(() => {

        let fakeModule = angular.module('test.module', []).value('testValue', { some: 'value' }).name;

        angular.mock.module(fakeModule);

    });

    it('should mock out an angular module', () => {

        // Given
            let mockedModule = { another: 'value' };

        // When
            radii.mockModule('testValue', mockedModule);

        // Then
            inject((testValue) => {
                expect(testValue).toEqual(mockedModule);
            });

    });
});
