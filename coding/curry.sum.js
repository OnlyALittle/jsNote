function sum(...args) {
	let sumNum = 0;
	for(let i = 0; i < args.length; i++) {
		sumNum += args[i];
	}
	function getSum(...parms) {
		for(let i = 0; i < parms.length; i++) {
			sumNum += parms[i];
		}
		return getSum;
	}
	getSum.sumof = () => sumNum;
	return getSum.bind(this);
}
console.log(sum(1,2,3)(1)(1).sumof());
