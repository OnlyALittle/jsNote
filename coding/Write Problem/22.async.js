async function name() {
	await name2();
}

async function name2(params) {
	
}



function _asyncToGenerator(genFn) {

	return new Promise((resolve, reject) => {
		let gen = genFn();
		function step(key, args) {
			let info = {}
			try {
				info = gen[key][args];
			} catch (error) {
				reject(error)
			}

			if (info.done) {
				resolve(info.value);
			} else {
				return Promise.resolve(info.value).then(v => {
					return step('next', v);
				}, (e) => {
					return step('throw', e);
				})
			}
		}
		step('next')
	})
}