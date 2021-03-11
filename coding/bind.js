Function.prototype.myCall = myCall;
Function.prototype.myBind = myBind;

function myBind(obj, ...rest) { 
	if (typeof this !== 'function') {
		throw new TypeError('Error')
	}
	let self = this;
	return function Func(...params) {
		if (this instanceof Func) {
			// new 的情况
			return new self(...rest, ...params);
		}
		return self.myCall(obj, ...rest, ...params);
	}
}

function myCall(obj, ...rest) {
	let ctx = obj;

	if (!obj) ctx = window;
	// 参数选择
	let parmas = [];
	if (rest[0] instanceof Array) {
		parmas = rest[0];
	} else {
		parmas = rest;
	}

	ctx.__fn = this;
	let res = ctx.__fn(...parmas);
	delete ctx.__fn;
	return res;
}


function a(...params) {
	console.log(this.a, params)
}

a.myCall({
	a:1
}, 2, 3);
let nOne = a.myBind({
	a:1
}, [2, 3]);
nOne()
