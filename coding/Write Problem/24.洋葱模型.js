// koa-compose

const callback = (time) => new Promise((r) => {
    setTimeout( () => {
        r();
    }, time)
})

async function p1(ctx, next) {
    console.log(1)
    await callback();
    await next();
    console.log('1-1')
}
async function p2(ctx, next) {
    console.log(2)
    await callback();
    await next();
    console.log('2-2')
}
async function p3(ctx, next) {
    console.log(3)
    await callback();
    await next();
    console.log('3-3')
}

async function doSomething() {
    console.log('hahahaha');
}

class Compose {
    constructor(middleware) {
        this.middleware = middleware;
    }

    dispatch(next) {
        let index = -1;
        let _this = this;

        return function _dispatch (i) {
            if (i <= index) return Promise.reject('next 次数太多')
            index = i;
            let fn = _this.middleware[index];
            if (index === _this.middleware.length) fn = next;
            if (!fn) return Promise.resolve();
            try {
                return Promise.resolve(
                    fn(_this, _dispatch.bind(null, index + 1))
                );
            } catch (err) {
                return Promise.reject(err);
            }
        }
    }
}


let c = new Compose([p1, p2, p3]);
c.dispatch(doSomething)(0).then(() => {
	console.log('all data deal finished');
});