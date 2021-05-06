

const PENDING = 'pending';
const FULFILLED = 'fulfilled';
const REJECTED = 'rejected';

function callWithErrorHandler(cb, reject) {
	try {
		cb();
	} catch (err) {
		reject(err)
	}
}

function asyncCallWithErrorHandler(cb, reject) {
	setTimeout(() => {callWithErrorHandler(cb, reject)});
}

class MyPromise {
	promiseStatus = PENDING;
	promiseResult;
	promiseReason;
	onFulfiledCbs = [];
	onRejectedCbs = [];

	constructor(exector) {
		const resolve = (val) => {
			if (this.promiseStatus !== PENDING) { return; }
			this.promiseStatus = FULFILLED
			this.promiseResult = val;
			this.onFulfiledCbs.length && setTimeout(() => {
				this.onFulfiledCbs.forEach(cb => {
					cb(val);
				});
			})
		}
		const reject = (reason) => {
			if (this.promiseStatus !== PENDING) { return };
			this.promiseStatus = REJECTED
			this.promiseReason = reason;
			this.onRejectedCbs.length && setTimeout(() => {
				this.onRejectedCbs.forEach(cb => {
					cb(val);
				});
			})
		}
		try {
			exector(resolve.bind(this), reject.bind(this));
		} catch (err) {
			reject(err)
		}
	}

	resolvePromise(promise2, x, resolve, reject) {
		let called = false;
		if (promise2 === x) reject('err');
		if (x instanceof MyPromise) {
			// 返回promise
			if (x.status === PENDING) {
				x.then(y => {
					MyPromise.resolvePromise(promise2, y, resolve, reject);
				})
			} else {
				x.then(resolve, reject)
			}
		} else if (typeof x === 'function' || (typeof x === 'object' && x !== null)) {
			try {
				const then = x.then;
				if (typeof then === 'function') {
					then.call(x, y => {
						if (called) return;
						called = true;
						MyPromise.resolvePromise(promise2, y, resolve, reject);
					}, err => {
						if (called) return;
						called = true;
						reject(err);
					})
				} else {
					resolve(x);
				}
			} catch (err) {
				if (called) return;
				called = true;
				reject(err);
			}
		} else {
			resolve(x);
		}
	}

	then(onFulfiled, onRejected) {
		// 格式化方法
		onFulfiled = typeof onFulfiled === 'function' ? onFulfiled : val => val;
		onRejected = typeof onRejected === 'function' ? onRejected : reason => {throw reason};

		// 链式
		let p2 = new MyPromise((resolve, reject) => {
			if (this.promiseStatus === PENDING) {
				this.onFulfiledCbs.push(() => {
					callWithErrorHandler(() => {
						let x = onFulfiled(this.promiseResult);
						resolvePromise(promise2, x, resolve, reject);
					}, reject);
				})
				this.onRejectedCbs.push(() => {
					callWithErrorHandler(() => {
						let x = onRejected(this.promiseReason);
						resolvePromise(promise2, x, resolve, reject)
					}, reject);
				})
			} else if (this.promiseStatus === FULFILLED) {
				asyncCallWithErrorHandler(() => {
					let x = onFulfiled(this.promiseResult);
					resolvePromise(promise2, x, resolve, reject)
				}, reject)
			} else {
				asyncCallWithErrorHandler(() => {
					let x = onRejected(this.promiseReason);
					resolvePromise(promise2, x, resolve, reject)
				}, reject)
			}
		})
		return p2;
	}

	catch(onRejected) {
		this.then(null, onRejected);
	}

	finally(cb) {
		return this.then(val => {
			MyPromise.resolve(cb).then(() => val)
		}, reason => {
			return MyPromise.resolve(cb).then(() => { throw reason })
		})
	}

	static resolve(value) {
		if (value instanceof MyPromise) return value;
		return new MyPromise(resolve => resolve(value));
	}

	static reject(err) {
		return new MyPromise((resolve, reject) => reject(err));
	}

	static all(promises) {
		let res = []
		let index = 0;
		return new MyPromise((resolve, reject) => {
			if (!promises.length) return resolve([]);
			for (let p of promises) {
				MyPromise.resolve(p).then((val) => {
					res[index] = val;
					if (++index === promises.length) resolve(res);
				}, reject);
			}
		});
	}

	static race(promises) {
		return new MyPromise((resolve, reject) => {
			if (!promises.length) return resolve();
			for (let p of promises) {
				MyPromise.resolve(p).then((val) => {
					return resolve(val);
				}, reason => {
					return reject(reason);
				})
			}
		});
	}
}


console.log("===START===")
const p4 = new MyPromise(resolve => {
    console.log('promise init');
    setTimeout(() => resolve("RESOLVED"))
});
p4.then(data => console.log(1,data))
p4.then(data => console.log(2,data))
p4.then(data => console.log(3,data))
console.log("===END===")
MyPromise.all([p4, 13]).then(res => {
    console.log(res)
})



