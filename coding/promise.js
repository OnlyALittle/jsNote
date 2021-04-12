function resolvePromise(selfPromise, result, resolve, reject){
    // 循环引用报错
    if(result === selfPromise){
      // reject报错
      return reject(new TypeError('Chaining cycle detected for promise'));
    }
    // 防止多次调用
    let called;
    // x不是null 且x是对象或者函数
    if (result != null && (typeof result === 'object' || typeof result === 'function')) {
      try {
        // A+规定，声明then = x的then方法
        let then = result.then;
        // 如果then是函数，就默认是promise了
        if (typeof then === 'function') { 
          // 就让then执行 第一个参数是this   后面是成功的回调 和 失败的回调
          then.call(result, y => {
            // 成功和失败只能调用一个
            if (called) return;
            called = true;
            // resolve的结果依旧是promise 那就继续解析
            resolvePromise(selfPromise, y, resolve, reject);
          }, err => {
            // 成功和失败只能调用一个
            if (called) return;
            called = true;
            reject(err);// 失败了就失败了
          })
        } else {
          resolve(result); // 直接成功即可
        }
      } catch (e) {
        // 也属于失败
        if (called) return;
        called = true;
        // 取then出错了那就不要在继续执行了
        reject(e); 
      }
    } else {
      resolve(result);
    }
}

function setTimeoutTryCatch(callback, reject){
    setTimeout(() => {
        try {
            callback();
        } catch (err) {
            reject(err);
        }
    });
}

// new Promise((resolve, reject) => {})

class PromiseClass {
    state = 'pending'; 
    value = undefined;
    exThorw = undefined;
    resolveCallbacks = [];
    rejectCallbacks = [];
    constructor(exector) {
        let resolve = value => {
            if (this.state === 'pending') {
                this.state = 'resolve';
                this.value = value;
                this.resolveCallbacks.forEach(func => func());
            }
        }
        let reject = value => {
            if (this.state === 'pending') {
                this.state = 'reject';
                this.exThorw = value;
                this.rejectCallbacks.forEach(func => func());
            }
        }
        try {
            exector(resolve, reject);
        } catch (err) {
            reject(err);
        }
    }
    then(fulCallback, errCallback) {
        fulCallback = typeof fulCallback === 'function' ? fulCallback : value => value;
        errCallback = typeof errCallback === 'function' ? errCallback : err => { throw err };
        let nextPromise = new PromiseClass((resolve, reject) => {
            if (this.state === 'resolve') {
                setTimeoutTryCatch(() => {
                    let res = fulCallback(this.value);
                    resolvePromise(nextPromise, res, resolve, reject);
                }, reject);
            }
            if (this.state === 'reject') {
                setTimeoutTryCatch(() => {
                    let err = errCallback(this.exThorw);
                    resolvePromise(nextPromise, err, resolve, reject);
                }, reject);
            }
            if (this.state === 'pending') {
                this.resolveCallbacks.push(() => {
                    setTimeoutTryCatch(() => {
                        let res = fulCallback(this.value);
                        resolvePromise(nextPromise, res, resolve, reject);
                    }, reject);
                });
                this.rejectCallbacks.push(() => {
                    setTimeoutTryCatch(() => {
                        let err = errCallback(this.exThorw);
                        resolvePromise(nextPromise, err, resolve, reject);
                    }, reject);
                });
            }
        });
        // 返回promise，完成链式
        return nextPromise;
    }
    catch(fn){
      return this.then(null,fn);
    }
    static resolve(val) {
        return new PromiseClass(resolve => {
            resolve(val);
        })
    }
    static reject(val) {
        return new PromiseClass((resolve, reject) => {
            reject(val);
        })
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
        function processData(index,data){
          arr[index] = data;
          i++;
          // 全部完成resolve
          if(i == promises.length){
            resolve(arr);
          };
        };
        return new Promise((resolve,reject)=>{
          for(let i=0;i<promises.length;i++){
            promises[i].then(data=>{
              processData(i, data);
            }, reject);
          };
        });
    }
     
}

let res = new PromiseClass((resolve, reject) => {
    setTimeout(() => {
        resolve(123)
    }, 1000)
})

res.then(res => {
    console.log('res:', res)
    return 456;
}).then(res => {
    console.log('res2:', res)
    throw '123'
}).catch(res => {
    console.log('catch:', res)
})
  
res.then(res => {
    console.log('res3:', res)
    return 789;
}).then(res => {
    console.log('res4:', res)
}).catch(res => {
    console.log('catch:', res)
})

