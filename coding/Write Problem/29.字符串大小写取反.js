function transformStr(str) {
	let res  = '';
	let aCode = 'a'.charCodeAt(0);
	let ACode = 'A'.charCodeAt(0);
	let step = aCode - ACode;
	for(let i = 0; i < str.length; i++) {
		let code = str.charCodeAt(i);
		// console.log(code, 'code')
		if (code < aCode) {
			res += String.fromCharCode(code + step);
		} else {
			res += String.fromCharCode(code - step);
		}
	}
	return res;
}

console.log(transformStr('asdasdADSdasdzasAsazxaAdasdsa'))
