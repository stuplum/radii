'use strict';

import radii from '../lib/radii';

describe('compileDirective', function () {

    it('should compile a directive', () => {

        // Given
            createDirective('myTestDirective', function () {
                return { };
            });

        // When
            let $myTestDirective = radii.compileDirective('<my-test-directive></my-test-directive>');

        // Then
            expect($myTestDirective).toHaveOuterHtml('<my-test-directive class="ng-scope"></my-test-directive>');

    });

    it('should update a scope value', () => {

        var updatedScopeValue = 'update me';

        // Given
            createDirective('myTestDirective', function () {
                return {
                    controller: function ($scope) {
                        $scope.testValue = '';
                        $scope.$watch('testValue', curr => {
                            updatedScopeValue = curr;
                        });
                    }
                };
            });

        // And
            let $myTestDirective = radii.compileDirective('<my-test-directive></my-test-directive>');

        // When
            $myTestDirective.updateScope('testValue', 'updated value');

        // Then
            expect(updatedScopeValue).toEqual('updated value');

    });

    it('should update a scope value on an isolate scope', () => {

        var updatedScopeValue = 'update me';

        // Given
            createDirective('myTestDirective', function () {
                return {
                    scope: {},
                    controller: function ($scope) {
                        $scope.testValue = '';
                        $scope.$watch('testValue', curr => {
                            updatedScopeValue = curr;
                        });
                    }
                };
            });

        // And
            let $myTestDirective = radii.compileDirective('<my-test-directive></my-test-directive>');

        // When
            $myTestDirective.updateScope('testValue', 'updated value');

        // Then
            expect(updatedScopeValue).toEqual('updated value');

    });

    it('should update a binding (controllerAs) without isolate scope', () => {

        var updatedScopeValue = 'update me';

        // Given
            createDirective('myTestDirective', function () {
                return {
                    controllerAs: 'ctrl',
                    controller: function ($scope) {
                        this.testValue = '';
                        $scope.$watch(() => this.testValue, curr => {
                            updatedScopeValue = curr;
                        });
                    }
                };
            });

        // And
            let $myTestDirective = radii.compileDirective('<my-test-directive></my-test-directive>');

        // When
            $myTestDirective.updateController('ctrl', 'testValue', 'updated value');

        // Then
            expect(updatedScopeValue).toEqual('updated value');

    });

    it('should update a binding (controllerAs) with isolate scope', () => {

        var updatedScopeValue = 'update me';

        // Given
            createDirective('myTestDirective', function () {
                return {
                    scope: {},
                    controllerAs: 'ctrl',
                    controller: function ($scope) {
                        this.testValue = '';
                        $scope.$watch(() => this.testValue, curr => {
                            updatedScopeValue = curr;
                        });
                    }
                };
            });

        // And
            let $myTestDirective = radii.compileDirective('<my-test-directive></my-test-directive>');

        // When
            $myTestDirective.updateController('ctrl', 'testValue', 'updated value');

        // Then
            expect(updatedScopeValue).toEqual('updated value');

    });

    it('should apply parent scope property', () => {

        // Given
            createDirective('myTestDirective', function () {
                return {
                    scope: { testValue: '@' },
                    template: '<span>{{ testValue }}</span>'
                };
            });

        // And
            let $myTestDirective = radii.compileDirective('<my-test-directive test-value="{{ testValueFromParentScope }}"></my-test-directive>', { $rootScope: { testValueFromParentScope: 'test value' } });

        // Then
            expect($myTestDirective.find('span')).toHaveText('test value');

    });

    it('should apply parent scope property when using controllerAs syntax', () => {

        // Given
            createDirective('myTestDirective', function () {
                return {
                    scope: { },
                    bindToController: { testValue: '@' },
                    controllerAs: 'ctrl',
                    controller: function () {},
                    template: '<span>{{ ctrl.testValue }}</span>'
                };
            });

        // And
            let $myTestDirective = radii.compileDirective('<my-test-directive test-value="{{ testValueFromParentScope }}"></my-test-directive>', { $rootScope: { testValueFromParentScope: 'test value' } });

        // Then
            expect($myTestDirective.find('span')).toHaveText('test value');

    });

    const scenarios = [
        { selector: '#two', expectedResults: 1 },
        { selector: '.a', expectedResults: 4 },
        { selector: '.b', expectedResults: 3 },
        { selector: '.c', expectedResults: 3 },
        { selector: '.a .b', expectedResults: 3 },
        { selector: '.a .c', expectedResults: 3 },
        { selector: '.a > .c', expectedResults: 2 },
        { selector: '.a.d', expectedResults: 1 },
        { selector: '.a.d .c', expectedResults: 1 }
    ];

    scenarios.forEach(scenario =>

        it(`should find elements by css selector [${scenario.selector}]`, () => {

            // Given
                const template = `<div>
                                       <em id="one" class="a">
                                           <i class="b"></i>
                                           <i class="b"></i>
                                       </em>
                                       <em id="two" class="a">
                                           <b class="c"></b>
                                       </em>
                                       <em id="three" class="a">
                                           <i class="b">
                                               <b class="c"></b>
                                           </i>
                                       </em>
                                       <em id="four" class="a d">
                                           <b class="c"></b>
                                       </em>
                                   </div>`;

                createDirective('myTestDirective', function () {
                    return { scope: { }, template: template };
                });

            // And
                const $myTestDirective = radii.compileDirective('<my-test-directive test-value="{{ testValueFromParentScope }}"></my-test-directive>', { $rootScope: { testValueFromParentScope: 'test value' } });

            // Then
                expect($myTestDirective.$find(scenario.selector).length).toEqual(scenario.expectedResults);

        })
    );

    it('should return an angular element', () => {

        // Given
            createDirective('myTestDirective', function () {
                return {
                    scope: { },
                    template: `<div><em id="one" class="a"></em></div>`
                };
            });

        // And
            const $myTestDirective = radii.compileDirective('<my-test-directive test-value="{{ testValueFromParentScope }}"></my-test-directive>', { $rootScope: { testValueFromParentScope: 'test value' } });

        // Then
            expect($myTestDirective.$find('.a').eq(0)).toBeAngularElement();

    });


    function createDirective(name, func) {

        let fakeDir = angular.module('test.directive', []).directive(name, func).name;

        angular.mock.module(fakeDir);

        return name;
    }
});
