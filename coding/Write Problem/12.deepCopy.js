function isObject(obj) {
	return Object.prototype.toString.call(obj) === '[object Object]'
}

function cloneDeep(obj, cache = new WeakMap()) {
	if (isObject(obj)) {
		let temp = {};
		cache.set(obj, 1);
		for (const key in obj) {
			if (!obj.hasOwnProperty(key)){
				continue
			}
			const value = obj[key];
			let t = cache.get(value)
			if (t) {
				console.log(t)
				temp[key] = t;
			} else {
				temp[key] = cloneDeep(value, cache);
			}
		}
		return temp;
	} else if (Array.isArray(obj)) {
		let arr = [];
		cache.set(obj, 1);
		for (const item of obj) {
			let t = cache.get(item)
			if (t) {
				console.log(t)
				arr.push(t);
			} else {
				arr.push(cloneDeep(item, cache));
			}
		}
		return arr;
	} else {
		return obj;
	}
}

var a = {
	c: a,
	a: null,
	aa: 1,
	bb: [1,{a:1}],
}
let b = cloneDeep(a)
console.log(a, b)
b.bb[1].a = 11;
console.log(a, b)
