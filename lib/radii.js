(function (global, radii) {

    'use strict';

    if (typeof require === 'function' && typeof exports === 'object' && typeof module === 'object') {
        // NodeJS
        module.exports = radii(require('angular'));
    } else {
        // Other environment (usually <script> tag).
        global.radii = radii(global.angular);
    }
}(this, function radii(ng) {

    'use strict';

    function extend() {
        return ng.extend.apply(ng, arguments);
    }

    function each() {
        return ng.forEach.apply(ng, arguments);
    }

    function mockModule(name, value) {
        ng.mock.module(function($provide) {
            $provide.value(name, value);
        });
    }

    function mockModules(modules) {
        ng.mock.module(function($provide) {
            each(modules, function(module) {
                $provide.value(module.name, module.value);
            });
        });
    }

    function compileController(ctrlName, locals, bindings) {

        var ctrl;

        inject(function($rootScope, $controller) {

            var $scope = $rootScope.$new();

            if(locals && locals.$scope) {
                $scope = extend($rootScope.$new(), locals.$scope);
                delete locals.$scope;
            }

            ctrl = $controller(ctrlName, extend({ $scope: $scope }, locals), extend({}, bindings));
            ctrl.$scope = function() { return $scope };
        });

        return ctrl;
    }

    function compileDirective(_el_, _config_) {

        var compiledEl,
            parentScope,
            config = _config_ || {};

        if (config.parentScope) {
            parentScope = config.parentScope;
            delete config.parentScope;
        }

        function createEl(el) {

            var $el = ng.element(el);

            if(parentScope) {
                each(parentScope, function (ctrl, name) {
                    var controllerName = ['$', name, 'Controller'].join('');
                    $el.data(controllerName, ctrl);
                });
            }

            return $el;
        }

        inject(function($rootScope, $compile) {

            extend($rootScope, config.$rootScope || {});

            compiledEl = $compile(createEl(_el_))($rootScope);

            compiledEl.updateScope = function (k, v) {

                var scope = compiledEl.isolateScope() || compiledEl.scope();

                scope[k] = v;
                scope.$apply();
            };

            compiledEl.updateController = function (ctrl, k, v) {

                var scope = compiledEl.isolateScope() || compiledEl.scope();

                scope[ctrl][k] = v;
                scope.$apply();
            };

            compiledEl.$find = function (selector) {

                var nodeList = this[0].querySelectorAll(selector);

                return angular.element(nodeList);
            };

            $rootScope.$digest();
        });

        return compiledEl;
    }

    return {
        loadModule: ng.mock.module,
        mockModule: mockModule,
        mockModules: mockModules,
        compileController: compileController,
        compileDirective: compileDirective
    }

}));