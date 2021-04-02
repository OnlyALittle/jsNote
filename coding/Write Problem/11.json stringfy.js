// 实现一个json.stringfy

// function  myStringfy(json) {
// 	let temp = '{';
// 	const lastKey = Object.keys(json).pop();
// 	for (const key in json) {
// 		const value = json[key];

// 		switch(Object.prototype.toString.call(value)) {
// 			case '[object Null]':
// 				temp += `"${key}": null`;
// 				break;
// 			case '[object Undefiend]':
// 			case '[object Function]':
// 				break;
// 			case '[object Object]':
// 				temp += `"${key}": ${myStringfy(value)}`;
// 				break;
// 			case '[object string]':
// 				temp += `"${key}": "${value}"`;
// 				break;
// 			default:
// 				temp += `"${key}": ${value}`;
// 				break;
// 		}
// 		if (lastKey !== key)
// 			temp += ','
// 	}

// 	temp += '}'
// 	return temp;
// }
function  myStringfy(json) {
	let temp;
	switch(Object.prototype.toString.call(json)) {
		case '[object Undefiend]':
		case '[object Function]':
			break;
		case '[object Object]':
			temp = '{';
			const lastKey = Object.keys(json).pop();
			for (const key in json) {
				temp += `"${key}": ${myStringfy(json[key])}`;
				if (lastKey !== key) temp += ','
			}
			temp += '}'
			break;
		case '[object Array]':
			temp = '[';
			const lastIndex = Object.keys(json).pop();
			for (const key in json) {
				temp += myStringfy(json[key]);
				if (lastIndex !== key) temp += ','
			}
			temp += ']'
			break;
		case '[object string]':
			temp = `"${json}"`
			break;
		default:
			temp = json;
			break;
	}
	return temp;
}

let jsonStr = myStringfy({
	a: 1,b:{c:2}, d:[1,2], e: [{a:1}, {b:2}]
})


// json.parse()

let data = (new Function(`return ${jsonStr}`))()

console.log(jsonStr, data)



