function sum(...rest) {
	let result = 0;
	rest.forEach(item => result += item);
	retFunc.sumof = () => result;
	function retFunc(...params) {
		params.forEach(item => result += item);
		return retFunc;
	}
	return retFunc
}

console.log(sum(1,2,3)(1)(1).sumof());