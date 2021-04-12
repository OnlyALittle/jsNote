// 说明：实现一个方法，用于比较两个版本号（version1、version2）

// 如果version1 > version2，返回1；如果version1 < version2，返回-1，其他情况返回0。
// 版本号规则`x.y.z`，xyz均为大于等于0的整数，至少有x位。


let version1 = '1.1.1'
let version2 = '1.2.1'

function compare(v1, v2) {

	let v1s = v1.split('.')
	let v2s = v2.split('.')

	while(v1s.length < v2s.length) v1s.push(0);
	while(v1s.length > v2s.length) v2s.push(0);

	for(let i = 0; i < v1s.length; i++) {
		if (+v1s[i] < +v2s[i]) {
			return -1;
		} else if (+v1s[i] > +v2s[i]) {
			return 1;
		}
	}
	return 0;
}

console.log(compare(version1, version2))