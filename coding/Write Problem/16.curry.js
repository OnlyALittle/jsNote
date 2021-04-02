function sum(...nums) {
	let s = 0;
	nums.forEach(item => s += item);
	rFn.sumof = () => s;
	function rFn(...p) {
		return sum(s, ...p)
	}
	return rFn;
}

console.log(sum(1,2,3)(1)(1).sumof());