// 异步请求通过 Promise.all 处理，怎么让其中失败的所有请求重试。

// Promise.all([A, B, C, D])
// 4 个请求完成后发现 AD 请求失败了，如果让 AD 请求重试

let errors = []

const mock = (name) => new Promise((resolve, reject) => {
	setTimeout(() =>{
		if(Math.random() > .5) {
			console.log(`${name}成功`)
			resolve(name);
		} else {
			console.log(`${name}失败`)
			reject(name);
		}
	}, 1000 * Math.random())
})

let t1 = mock('t1')
let t2 = mock('t2')
let t3 = mock('t3')
let t4 = mock('t4')
let t5 = mock('t5')


const all = (arr) => {
}

all([t1,t2,t3,t4,t5])
