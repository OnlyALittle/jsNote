// 请实现 flattened 方法，输入 `[[0,1],[3,4],[4,5]]` ，输出`[0,1,3,4,5]` 
const a = [[0,1],[3,4],[4,5],[[6]],[[7]]];

const flattened = (data, level) => {
	if (level === 0) return data;
	let res = []
	data.forEach(item => {
		if (Array.isArray(item)){
			res = res.concat(flattened(item, level - 1)); 
		} else {
			res.push(item);
		}
	})
	return res;
}


console.log(flattened(a, 1))
console.log(flattened(a))
