// 给定一个任意数组，实现一个通用函数，让数组中的数据根据 key 排重：

// const dedup = (data, getKey = () => {} ) => {
//   // todo
// }
// let data1 = [
//   { id: 1, v: 1, id1: 1 },
//   { id: 2, v: 2, id1: 2 },
//   { id: 1, v: 1, id1: 1 },
// ]

// 以 id 和 id1 作为排重 key，执行函数得到结果
// data1 = [
//   { id: 1, v: 1, id1: 1 },
//   { id: 2, v: 2, id1: 2 },
// ];
// console.log(dedup(data, (item) => `${item.id}|${item.id1}`))

const dedup = (data, getValue = () => {} ) => {
	let obj = []
	let keys = getValue();
	return data.filter(item => {
		return keys.every((key, index) => {
			if (!item.hasOwnProperty(key)) return true; //不比较，认为
			const value = item[key] // 拿到值
			if (!obj[index]) obj[index] = [];
			if (obj[index].includes(value)) {
				return false;
			} else {
				obj[index].push(value)
				return true;
			}
		})
	});
}



let data1 = [
  { id: 1, v: 1, id1: 1 },
  { id: 2, v: 2, id1: 2 },
  { id: 1, v: 1, id1: 1 },
]
const data4 = [
    { id: 1, v: 1, id1: 1 },
    { id: 2, v: 2, id1: 2 },
    { id: 3, v: 1, id1: 3 },
    { id: 1, v: 1, id1: 1 },
    { id: 1, v: 1, id1: 1 },
    { id: 6, v1: 1, id1: 4 }
]

console.log(dedup(data1, () => ['id', 'id1']))
console.log(dedup(data4, () => ['id', 'id1', 'v']))
