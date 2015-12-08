'use strict';

import radii from '../lib/radii';

describe('compileController', function () {

    it('should compile a controller', () => {

        // Given
            let fakeCtrl = fakeController(function () {});

        // When
            let ctrl = radii.compileController(fakeCtrl);

        // Then
            expect(ctrl).toBeDefined();

    });

    it('should create access to a controllers scope', () => {

        // Given
            let fakeCtrl = fakeController(function ($scope) {
                $scope.testValue = 'test value';
            });

        // When
            let ctrl = radii.compileController(fakeCtrl);

        // Then
            expect(ctrl.$scope().testValue).toEqual('test value');

    });

    it('should make scope accessible', () => {

        // Given
            let fakeCtrl = fakeController(function () {});

        // When
            let ctrl = radii.compileController(fakeCtrl, { $scope: { someValue: 'value from rootScope' } });

        // Then
            expect(ctrl.$scope().someValue).toEqual('value from rootScope');

    });

    it('should make scope accessible by controller', () => {

        // Given
            let fakeCtrl = fakeController(function ($scope) {
                $scope.testValue = $scope.someValue;
            });

        // When
            let ctrl = radii.compileController(fakeCtrl, { $scope: { someValue: 'value from rootScope' } });

        // Then
            expect(ctrl.$scope().testValue).toEqual('value from rootScope');

    });

    it('should add bindings for use with controllerAs', () => {

        // Given
            let fakeCtrl = fakeController(function ($scope) {
                $scope.testValue = this.name;
            });

        // When
            let ctrl = radii.compileController(fakeCtrl, {}, { name: 'dave' });

        // Then
            expect(ctrl.name).toEqual('dave');

        // And:
            expect(ctrl.$scope().testValue).toEqual('dave');

    });

    function fakeController(ctrl) {

        let name = 'TestCtrl';

        let fakeCtrl = angular.module('test.ctrl', []).controller(name, ctrl).name;

        angular.mock.module(fakeCtrl);

        return name;
    }
});
