function Parent(name, age) {
	this.name = name;
	this.age = age;
}
Parent.prototype.getName = function () {
	return this.name;
}

function Child(name, age) {
	Parent.call(this, name, age)
}

Child.prototype = Object.create(Parent.prototype, {
	constructor: {
		value: Child,
		configurable: false
	}
})

let c = new Child('小米', 123)
console.log(c.getName())
console.log(c, c.__proto__)



