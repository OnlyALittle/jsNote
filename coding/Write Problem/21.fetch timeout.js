function fetch_timeout(url, param, timeout = 5000) {
	let fetchPromise = fetch(url, param);
	let timer

	let abortPromise = new Promise((resolve, reject) => {
		timer = setTimeout(() => {
			reject({
				code: 504,
				message: "请求超时！"
			  });
		}, timeout);
	});
	// 最快出结果的promise 作为结果
	let resultPromise = Promise.race([fetchPromise, abortPromise]);
	
	return resultPromise.then(res => {
		clearTimeout(timer);
		return res;
	});
}