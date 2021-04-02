function setTimeoutTryCatch(callback, reject){
    setTimeout(() => {
        try {
            callback();
        } catch (err) {
            reject(err);
        }
    });
}

class MyPromise {
    PENDING = 'pending'
    FULFILLED = 'fulfilled'
    REJECTED = 'rejected'
    constructor(exector) {
        this.status = MyPromise.PENDING;
        this.value = null;
        this.reason = null;
        this.onFulfilledCallback = [];
        this.onRejectedCallback = [];
        this.initBind();
        this.init(exector);
    }
    initBind() {
        // 绑定 this
        // 因为 resolve 和 reject 会在 exector 作用域中执行，因此这里需要将 this 绑定到当前的实例
        this.resolve = this.resolve.bind(this);
        this.reject = this.reject.bind(this);
    }
    init(exector) {
        // 执行new的逻辑
        try {
            exector(this.resolve, this.reject);
        } catch (err) {
            this.reject(err);
        }
    }
    static resolve(value) {
        setTimeout(() => {
            if (this.status === MyPromise.PENDING) {
                this.status = MyPromise.FULFILLED;
                this.value = value;
                this.onFulfilledCallback.forEach(cb => cb(this.value))
            }
        });
        
    }
    static reject(reason) {
        setTimeout(() => {
            if (this.status === MyPromise.PENDING) {
                this.status = MyPromise.REJECTED;
                this.reason = reason;
                this.onRejectedCallback.forEach(cb => cb(this.reason))
            }
        })
    }
    resolvePromise(promise2,x,resolve,reject) {
        let called = false;
        if(promise2 === x){
            return reject(new TypeError("cannot return the same promise object from onfulfilled or on rejected callback."))
        }
        if(x instanceof MyPromise) {
            // 处理返回值是 Promise 对象的情况
             /**
             * new MyPromise(resolve => {
             *  resolve("Success")
             * }).then(data => {
             *  return new MyPromise(resolve => {
             *    resolve("Success2")
             *  })
             * })
             */
            if(x.status === MyPromise.PENDING){
                x.then(y => {
                    // 使用 “return”链中最后一个 Promise 对象的状态，来决定 promise2 的状态
                    MyPromise.resolvePromise(promise2, y, resolve, reject)
                }, reason => reject(reason))
            } else {
                x.then(resolve,reject)
            }
        } else if((x !== null && typeof x === "object") || typeof x === "function"){
            // 处理返回值是 函数 和 对象的情况
            // then 方法可能设置了访问限制（setter），因此这里进行了错误捕获处理
            try {
                const then = x.then;
                then.call(x, y => {
                    if (called) return;
                    called = true;
                    MyPromise.resolvePromise(promise2, y, resolve, reject)
                }, reason => {
                    if (called) return;
                    called = true;
                    reject(reason)
                })
            } catch(err) {
                if(called) return;
                called = true;
                reject(e)
            }
        } else resolve(x)
    }

    then(onFulfilled, onRejected) {
        // 考虑then(1)这种情况
        // init function
        onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : (value) => value;
        onRejected = typeof onRejected === 'function' ? onRejected : (reason) => {  throw reason };
        let promise2;

        if (this.status !== MyPromise.PENDING) {
            return promise2 = new MyPromise((resolve, reject) => {
                setTimeoutTryCatch(() => {
                    let res = 
                        this.status === MyPromise.FULFILLED ? 
                            onFulfilled(this.value):
                            onRejected(this.reason)
                    MyPromise.resolvePromise(promise2, res, resolve, reject)
                }, reject);
            })
        }
        if (this.status === MyPromise.PENDING) {
            return promise2 = new MyPromise((resolve,reject) => {
                this.onFulfilledCallback.push((value) => {
                    try {
                        const res = onFulfilled(value);
                        MyPromise.resolvePromise(promise2, res, resolve, reject)
                    } catch(err) {
                        reject(err);
                    }
                })
                this.onRejectedCallback.push((reason) => {
                    try {
                        const res = onRejected(reason);
                        MyPromise.resolvePromise(promise2, res, resolve, reject)
                    } catch(err) {
                        reject(err);
                    }
                })
            })
        }
    }

    catch(fn){
        return this.then(null,fn);
    }
    static race(promises){
        return new Promise((resolve,reject)=>{
            for(let i=0;i<promises.length;i++){
                promises[i].then(resolve,reject)
            };
        })
    }
    static all(promises){
        let arr = [];
        let i = 0;
        function processData(index, data, resolve){
          arr[index] = data;
          i++;
          // 全部完成resolve
          if(i == promises.length){
            resolve(arr);
          };
        };
        return new MyPromise((resolve,reject)=>{
            for(let i = 0; i < promises.length; i++){
                promises[i].then(data => {
                    processData(i, data, resolve);
                }, reject);
            };
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