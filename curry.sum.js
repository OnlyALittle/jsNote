function sum() {
	let args = arguments;
	let sumNum = 0;
	for(let i = 0; i < args.length; i++) {
		sumNum += args[i];
	}

	function getSum() {
		let args = arguments;
		for(let i = 0; i < args.length; i++) {
			sumNum += args[i];
		}
		return getSum;
	}
	getSum.sumof = () => sumNum;
	return getSum.bind(this);
}
console.log(sum(1,2,3)(1)(1).sumof());
