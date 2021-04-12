// bind
Function.prototype.myBind = function (ctx, ...params) {
	if (typeof this !== 'function') throw new TypeError('必须是方法')
	let self = this;
	return function newFunc(...args) {
		// new
		if (this instanceof newFunc) {
			let t = Object.create(this.prototype);
			let res = this.apply(t, args)
			return typeof res === 'object' ? res : t
			// return new self(...params, ...args)
		}
		return self.myCall(ctx, [...params, ...args]);
	}
}


// call
Function.prototype.myCall = function (ctx, ...params) {
	let _ctx = ctx || globalThis;
	let temp = Symbol('fn');
	_ctx[temp] = this;
	let res = _ctx[temp](...params);
	delete _ctx[temp];
	return res;
}

// apply

Function.prototype.myApply = function (ctx, params) {
	let _ctx = ctx || globalThis;
	let temp = Symbol();
	_ctx[temp] = this;
	let res = _ctx[temp](...params);
	delete _ctx[temp];
	return res;
}

function a(...params) {
	console.log(this.a, params)
}

a.myCall({
	a:1
}, 2, 3);
let nOne = a.myBind({
	a:2
}, [2, 3]);
nOne()
