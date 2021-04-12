let entrys = {
	'index.js': function(module, exports, require) {
		var module1 = require("./module1");
		var module2 = require("./module2");

		module1.foo();
		module2.foo();

		function hello(){
			console.log("Hello!");
		}

		module.exports = hello;
	}
}

//require
(function(modules, entry) {
	var installedModules = {};
	function require(moduleName) {
		if (installedModules[moduleName]) {
			return installedModules[moduleName].exports;
		}

		var module = installedModules[moduleName] = {
			exports: {},
			moduleName,
			loaded: false
		}

		modules[moduleName].call(module.exports, module, module.exports, require);
		module.loaded = true;
		return module.exports;
	}
	return require(entry)
})(entrys, entry)
 