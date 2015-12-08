## AngularJS unit test helpers

### loadModule

alias from angular.mock.module(...);

### mockModule

Provides a means to add fake or mock existing angular modules, replaces need to inject '$provide' in tests. 

### mockModules

Provides ability to mock multiple modules. (see mock module)

### compileDirective

Removes boilerplate required to instantiate a directive in tests. It is possible to inject values onto the rootscope to allow for easy mocking of bindings.

Also exposes methods for updating scope, useful if you ae having trouble getting events to register.

### compileController

Removes boilerplate required to compile a controller in tests.

From:
'''
describe('myController', function () {
  it('should write the bound name to the log', inject(function($controller, $log) {
    var ctrl = $controller('MyController', {}, { name: 'Clark Kent' });
    expect(ctrl.name).toEqual('Clark Kent');
    expect($log.info.logs).toEqual(['Clark Kent']);
  });
});
'''

To:
'''
describe('myController', function() {
  it('should write the bound name to the log', inject(function($log) {
    var ctrl = compileController('MyController', {}, { name: 'Clark Kent' });
    expect(ctrl.name).toEqual('Clark Kent');
    expect($log.info.logs).toEqual(['Clark Kent']);
  });
});
'''

Usage:
    compileController(constructor, locals, [bindings]);
    
Returns:
    instance of controller with $scope method that reveals the scope used for the controller.


## Running Tests

    npm test