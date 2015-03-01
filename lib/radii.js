(function (global, radii) {
    
    'use strict';

    radii = radii();

    // Module systems magic dance.

    if (typeof require === 'function' && typeof exports === 'object' && typeof module === 'object') {
        // NodeJS
        module.exports = radii;
    } else if (typeof define === 'function' && define.amd) {
        // AMD
        define(function () {
            return radii;
        });
    } else {
        // Other environment (usually <script> tag).
        global.radii = radii;
    }
}(this, function radii() {

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
        module(function($provide) {
            $provide.value(name, value);
        });
    }

    function mockModules(modules) {
        module(function($provide) {
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

            $rootScope.$digest();
        });

        return compiledEl;
    }

    return {
        mockPromise: mockPromise,
        mockModule: mockModule,
        mockModules: mockModules,
        compileController: compileController,
        compileDirective: compileDirective
    }

}));