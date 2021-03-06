Array.prototype.myReduce = function(callback, initValue) {
	if (!Array.isArray(this) || !this.length || typeof callback !== 'function') {
		return [];
	}
	let hasInit = initValue === undefined;
	let value = hasInit ? initValue : this[0];

	for(let i = hasInit ? 0 : 1; i < this.length; i++) {
		let cur = this[i];
		value = callback(value, cur, i, this);
	}
	return value;
}