const cb = (time, name) => (remark) => new Promise((resolve, reject) => {
    console.log(`${name} ${remark} 开始`)
    setTimeout(() => {
        if(Math.random() > 0.5) {
            console.log(`${name} ${remark} 失败`)
            reject()
        } else {
            console.log(`${name} ${remark} 成功`)
            resolve()
        }
    }, time)
})

class Action {
    constructor(promises, max = 2, maxError = 2) {
        this.errorsMap = new Map();
        this.max = max;
        this.maxError = maxError;
        this.doAction = 0;
        this.promises = promises || [];
    }

    add(list) {
        this.promises = this.promises.concat(list);
        this.do();
    }

    doPromise(prMethod) {
        if (!prMethod) this.doAction--;
        else {
            let errNums = this.errorsMap.get(prMethod) || 0;
             prMethod(errNums === 0 ? '' : `第${errNums}次重试`).catch(() => {
                // let errNums = this.errorsMap.get(prMethod) || 0;
                errNums++;
                this.errorsMap.set(prMethod, errNums);
                if (errNums && errNums >= this.maxError) {
                    console.log('重试失败')
                    return
                } else {
                    this.promises.push(prMethod);
                }
            }).finally(() => {
                this.doAction--;
                this.do();
            })
        }
           
    }
    do() {
        if (this.doAction >= this.max) return;
        let needAction = this.promises.splice(0, this.max - this.doAction);
        this.doAction += needAction.length;
        needAction.forEach(item => {
            this.doPromise(item);
        })
    }
}

let cbs = [cb(1000, 1), cb(2000, 2), cb(500, 3), cb(1500, 4), cb(1500, 5)]
let test = new Action(cbs);
test.do();
setTimeout(() => {
	test.add([cb(100, 6), cb(500, 7)])
}, 500)

