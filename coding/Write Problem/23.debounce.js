// debounce

function debounce(fn, wait, immediate = false) {
	let timer;

	return function(...args) {
		let ctx = this;
		timer && clearTimeout(timer);
		if (immediate && !timer) fn.apply(ctx, args)
		timer = setTimeout(() => {
			fn.apply(ctx, args)
		}, wait)
	}
}

//throttle

function throttle(fn, wait, trailing = false, leading = true) {
	let now = 0, timer;

	return function(...args) {
		let ctx = this;
		let nowDate = Date.now();
		// 尾部执行 并且存在计时器的话清空计时器
		if (trailing && timer) clearTimeout(timer);

		// 首次执不执行，来给now赋一个初始值
		if (!leading && now === 0) now = nowDate // 首次执不执行
		
		if (timer) {
			clearTimeout(timer);
			timer = null;
		}
		// 还要多久
		let needWait = nowDate - now - wait;
		if(needWait <= 0) {
			now = nowDate;
			fn.apply(ctx, args)
		} else if (!timer && trailing) {
			timer = setTimeout(() => {
				now = leading === true ? 0 : Date.now();
				fn.apply(ctx, args)
				ctx = args = null;
			}, wait)
		}
	}
}
