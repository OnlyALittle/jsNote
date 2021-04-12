// 有一个嵌套层次很深的对象，key 都是 a_b 形式 ，需要改成 ab 的形式，注意不能用递归。

// const a = {
//   a_y: {
//     a_z: {
//       y_x: 6
//     },
//     b_c: 1
//   }
// }
// ==>
// {
//   ay: {
//     az: {
//       yx: 6
//     },
//     bc: 1
//   }
// }

const a = {
  a_y: {
    a_z: {
      y_x: 6
    },
    b_c: 1
  }
}

const chageKey = (obj, cb) => {
	let stack = [obj];
	while(stack.length) {
		let temp = stack.shift();
		for (const key in temp) {
			if (Object.hasOwnProperty.call(temp, key)) {
				const item = temp[key];
				temp[cb(key)] = item;
				delete temp[key];
				item instanceof Object && stack.push(item);
			}
		}
	}
	return obj;
}

const chageKey2 = (obj) => {
	return JSON.parse(JSON.stringify(obj).replace(/_/g, ''));
}

console.log(chageKey2(a))
console.log(chageKey(a, (key) => {
	let keys =  key.split('_')
	let first = keys[0];
	let other = keys.slice(1, keys.length).map(item => {
		let t = item.split('');
		let f = t.splice(0, 1)
		let o = t.join('');
		return `${f[0].toLocaleUpperCase()}${o}`
	})
	return `${first}${other.join('')}`
}))