function myCallAndAplly(...args) {
	let content;
	let realArgs;
	if (args.length === 0) {
		content = window;
	} else {
		content = [].shift.call(args);
	}
	if (Array.isArray(args[0])) {
		realArgs = args[0];
	} else {
		realArgs = args;
	}

	// 此时的this为function，
	// 把this挂在content下就可以把这个方法的this指向content了
	content.__fn = this;
	const res = content.__fn(...realArgs);
	delete content.__fn;
	return res;
}

function myBind(content, ...args) {
	if (typeof this !== 'function') throw 'need function';
	const self = this;
	return (...rest) => this.call(content, ...args, ...rest);
	// return (...rest) => this.myCallAndAplly(content, ...args, ...rest);
}

Function.prototype.myCallAndAplly = myCallAndAplly;
Function.prototype.myBind = myBind;

function a() {}

a.myCallAndAplly({
	a:1
}, [2, 3]);