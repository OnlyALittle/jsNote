// • 以构造器的prototype属性为原型，创建新对象；
// • 将this(也就是上一句中的新对象)和调用参数传给构造器，执行；
// • 如果构造器没有手动返回对象，则返回第一步创建的新对象，如果有，则舍弃掉第一步创建的新对象，返回手动return的对象。

const Fun = function (name) {
	this.name = name
}
Fun.prototype.getName = function() {
	console.log(this.name)
}
let fun = createObj(Fun, 'gim')
fun.getName() // gim


function createObj(fn, ...params) {
	let temp = Object.create(fn.prototype)
	let res = fn.apply(temp, [...params]);
	return typeof res === 'object' ? res : temp
}