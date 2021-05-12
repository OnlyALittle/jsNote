// 实现 (5).add(3).minus(2) 功能。

Number.prototype.add = function (i = 0) {
	let cur = this.digits();
	let iVal = i.digits();

	// 拿到要乘的基数
	const baseNum = Math.pow(10, Math.max(cur, iVal));

	const result = (this.valueOf() * baseNum + i.valueOf() * baseNum) / baseNum;

	if (result > 0) {
		return result > Number.MAX_SAFE_INTEGER ? Number.MAX_SAFE_INTEGER : result;
	} else {
		return result < Number.MIN_SAFE_INTEGER ? Number.MIN_SAFE_INTEGER : result;
	}
}

Number.prototype.minus = function (i = 0) {
	let cur = this.digits();
	let iVal = i.digits();

	// 拿到要乘的基数
	const baseNum = Math.pow(10, Math.max(cur, iVal));

	const result = (this.valueOf() * baseNum - i.valueOf() * baseNum) / baseNum;

	if (result > 0) {
		return result > Number.MAX_SAFE_INTEGER ? Number.MAX_SAFE_INTEGER : result;
	} else {
		return result < Number.MIN_SAFE_INTEGER ? Number.MIN_SAFE_INTEGER : result;
	}
	
}

Number.MAX_SAFE_DIGITS = Number.MAX_SAFE_INTEGER.toString().length - 2

Number.prototype.digits = function () {
	// 小数的位数
	let digitsLen = (this.valueOf().toString().split('.')[1] || '').length;

	// 获取最大安全计算长度

	return digitsLen > Number.MAX_SAFE_DIGITS ? Number.MAX_SAFE_DIGITS : digitsLen;
}


// console.log((1.1).add(1.3).minus(1))




let data = {1:222, 2:123, 5:888}
let arr = Array.from(new Array(12), (v, i) => i + 1)
console.log(arr.map(item => {
	
	return data[item] || null;
}))