/**
 * 大数相加
 * @param {string} a 
 * @param {string} b 
 * @return {string}
 */
function bigNumberSum(a, b) {
    return (BigInt(a) + BigInt(b)).toString()
}

function bigNumberAdd(a, b) {
	let count = 0;
	let end = '';
	let left = a.split('').reverse()
	let right = b.split('').reverse()
	let maxLen = Math.max(left.length, right.length);
	let i = 0;
	while(i < maxLen) {
		let t1 = left[i] || 0
			t2 = right[i] || 0
		let res = parseInt(t1) + parseInt(t2) + count;
		end += (res % 10);
		count = parseInt(res / 10);
		i++;
	}
	return end.split('').reverse().join('')
}

console.log(bigNumberAdd('1111111111111111111', '199'))