// 提供一个异步 add 方法如下，需要实现一个 await sum(...args) 函数：

function asyncAdd(a, b, callback) {
	setTimeout(function () {
	  callback(null, a + b);
	}, 1000);
}


async function sum(nums) {
	if (nums.length <= 1) return nums[0];
	const calc = (num1, num2) => new Promise(r => {
		asyncAdd(num1, num2, (p1, p2) => {
			r(p2)
		})
	})

	let promises = [];

	for (let i = 0; i < nums.length; i++) {
		const item = nums[i];
		const nextItem = nums[i+1]; 
		promises.push(calc(item, nextItem || 0));
		i++;
	}
	let total = 0
	await Promise.all(promises).then(async (res) => {
		total = await sum(res);
	})
	return total
}
console.time('sum')
sum([1,2,3,4,5,6,7]).then(res => {
	console.log(res, 'res')
	console.timeEnd('sum')
})

