const isType = (type) => (val) => Object.prototype.toString.call(val) === `[object ${type}]`;
const isObject = (val) => isType('Object')(val);

function cloneDeep(target) {

	if (isObject(target)) {
		var obj = {};
		Object.keys(target).forEach(function(key) {
			obj[key] = cloneDeep(target[key]);
		});
		return obj;
	} else if (Array.isArray(target)) {
		var arr = [];
		for (var i = 0; i < target.length; i++) {
			arr[i] = cloneDeep(target[i]);
		}

		return arr;
	}
	return target;
}


let a = {
	a: null,
	aa: 1,
	bb: [1,{a:1}]
}
let b = cloneDeep(a)
console.log(a, b)