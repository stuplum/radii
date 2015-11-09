(function (global, radii) {

    'use strict';

    if (typeof require === 'function' && typeof exports === 'object' && typeof module === 'object') {
        // NodeJS
        module.exports = radii(require('angular'));
    } else {
        // Other environment (usually <script> tag).
        global.radii = radii(global.angular);
    }
}(this, function radii(angular) {

    'use strict';

    function extend() {
        return angular.extend.apply(angular, arguments);
    }

    function each() {
        return angular.forEach.apply(angular, arguments);
    }

    function mockPromise(yields, returns) {

        var _then  = sinon.stub(),
            _catch = sinon.stub();

        if(yields)  { _then.yields(yields); }
        if(returns) { _then.returns(returns); }

        return { then: _then, catch: _catch };
    }

    function mockModule(name, value) {
        angular.mock.module(function($provide) {
            $provide.value(name, value);
        });
    }

    function mockModules(modules) {
        angular.mock.module(function($provide) {
            each(modules, function(module) {
                $provide.value(module.name, module.value);
            });
        });
    }

    function compileController(ctrlName, argsObject) {

        var ctrl;

        inject(function($rootScope, $controller) {

            var $scope = $rootScope.$new();

            if(argsObject && argsObject.$scope) {
                $scope = extend($rootScope.$new(), argsObject.$scope);
                delete argsObject.$scope;
            }

            ctrl = $controller(ctrlName, extend({ $scope: $scope }, argsObject));
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

            var $el = angular.element(el);

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
                compiledEl.scope()[k] = v;
                compiledEl.scope().$apply();
            };

            compiledEl.updateController = function (ctrl, k, v) {
                compiledEl.isolateScope()[ctrl][k] = v;
                compiledEl.isolateScope().$apply();
            };

            $rootScope.$digest();
        });

        return compiledEl;
    }

    return {
        mockPromise: mockPromise,
        loadModule: angular.mock.module,
        mockModule: mockModule,
        mockModules: mockModules,
        compileController: compileController,
        compileDirective: compileDirective
    }

}));