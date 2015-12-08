'use strict';

import radii from '../lib/radii';

describe('mockModules', function () {

    beforeEach(() => {

        let fakeModule1 = angular.module('test.module.1', []).value('testValue1', { some: 'value-1' }).name;
        let fakeModule2 = angular.module('test.module.2', []).value('testValue2', { some: 'value-2' }).name;

        angular.mock.module(fakeModule1, fakeModule2);

    });

    it('should mock out multiple angular modules', () => {

        // Given
            let mockedModule1 = { another: 'value-1' };
            let mockedModule2 = { another: 'value-2' };

        // When
            radii.mockModules([
                { name: 'testValue1', value: mockedModule1 },
                { name: 'testValue2', value: mockedModule2 }
            ]);

        // Then
            inject((testValue1, testValue2) => {
                expect(testValue1).toEqual(mockedModule1);
                expect(testValue2).toEqual(mockedModule2);
            });

    });
});
