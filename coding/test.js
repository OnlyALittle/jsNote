
function throttle(func, wait = 50, options = {}) {
    let timer, ctx, args;
	let prev = 0;

    return function(...parmas) {
        let now = Date.now();
        ctx = this;
        args = parmas;
        // 是否忽略第一次的调用，为啥加一个prev === 0的条件，是因为不能每次都重置
        if (prev === 0 && options.leading === false) {
            prev = now;
        }

        // 还需等待时间
        let remaining = wait - (now - prev);

        if (remaining <= 0 || remaining > wait) {
            if (timer) {
                clearTimeout(timer);
                timer = null;
            }
            func.apply(ctx, args);
            prev = now;
            ctx = args = null;
        } else if(!timer && options.trailing !== false) {
            // 考虑remaining === wait的情况
            timer = setTimeout(() => {
                // 这步为什么不是立即置为now
                // 考虑一个settimeout之后，又触发了一次，此时不置为0会有问题
                prev = options.leading === false ? 0 : Date.now();

                func.apply(ctx, args);
                ctx = args = null;
            }, wait)
        }
    }
}




