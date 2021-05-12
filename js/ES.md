# Proxy
# Reflect
- Reflect对象的设计目的有这样几个。
  1. 将Object对象的一些明显属于语言内部的方法（比如Object.defineProperty），放到Reflect对象上。
     -  现阶段，某些方法同时在Object和Reflect对象上部署，未来的新方法将只部署在Reflect对象上。
  2. 修改某些Object方法的返回结果，让其变得更合理。
     - 比如，Object.defineProperty(obj, name, desc)在无法定义属性时，会抛出一个错误，
     - 而Reflect.defineProperty(obj, name, desc)则会返回false。
  3.  让Object操作都变成函数行为。
      - 某些Object操作是命令式，比如name in obj和delete obj[name]，
      - 而Reflect.has(obj, name)和Reflect.deleteProperty(obj, name)让它们变成了函数行为。
  4.  Reflect对象的方法与Proxy对象的方法一一对应，只要是Proxy对象的方法，就能在Reflect对象上找到对应的方法。
      - 这就让Proxy对象可以方便地调用对应的Reflect方法，完成`默认行为`，作为修改行为的基础。
      - 也就是说，不管Proxy怎么修改默认行为，你总可以在Reflect上获取默认行为。

# Iterator
- Iterator的遍历过程
  1. 创建一个空对象，指向第一项
  2. 调用next，指针移到下一项
- 默认的Iterator接口部署在数据结构的Symbol.iterator属性
- for...of循环会自动遍历它们
- 调用`Iterator`的场景：解构运算符、扩展运算符、yield*、
- return()，throw()
  - 如果for...of循环提前退出（通常是因为出错，或者有break语句或continue语句），就会调用return方法。
  - 如果一个对象在完成遍历前，需要清理或释放资源，就可以部署return方法。

# Generator
- 异步编程解决方案
- 执行Generator函数会返回一个遍历器对象，也就是说，Generator函数除了状态机，还是一个遍历器对象生成函数。
- 返回的遍历器对象，可以依次遍历Generator函数内部的每一个状态。
- 与Iterator接口的关系
  - 由于Generator函数就是遍历器生成函数，因此可以把Generator赋值给对象的Symbol.iterator属性，从而使得该对象具有Iterator接口。
- 错误捕获
  - Generator.prototype.throw() 可以抛出错误
  - 在外部使用try去捕获
	```ts
	var g = function* () {
		while (true) {
			try {
				yield;
			} catch (e) {
				if (e != 'a') throw e;
				console.log('内部捕获', e);
			}
		}
	};

	var i = g();
	i.next();

	try {
		throw new Error('a');
		throw new Error('b');
	} catch (e) {
		console.log('外部捕获', e);
	}
	// 外部捕获 [Error: a]
	```
- Generator.prototype.return()
  - 返回给定的值，并且终结遍历Generator函数。
- 如果在Generater函数内部，调用另一个Generator函数，默认情况下是没有效果的。
  - 可以使用 yield*语句 来处理，等同于用了一个for-of


# Decorator
- 类的修饰
  - 修改类的行为，发生在代码编译阶段
	```ts
		@decorator
		class A {}
		// 等同于
		class A {}
		A = decorator(A) || A;
	```
- 方法的修饰
  - 修饰器不仅可以修饰类，还可以修饰类的属性。
  - 如果同一个方法有多个修饰器，会像剥洋葱一样，先从外到内进入，然后由内向外执行。
  - 为什么修饰器不能用于函数？因为存在函数提升。


# Symbol
- 每个从Symbol()返回的symbol值都是唯一的。一个symbol值能作为对象属性的标识符；这是该数据类型仅有的目的
```js
var s1 = Symbol('foo');
var s2 = Symbol('foo');

s1 === s2 // false

s1.toString() // "Symbol(foo)"
s2.toString() // "Symbol(foo)"
```
-  Symbol 的参数是一个对象，就会调用该对象的toString方法，将其转为字符串，然后才生成一个 Symbol 值。
```js
const obj = {
  toString() {
    return 'abc';
  }
};
const sym = Symbol(obj);
sym // Symbol(abc)
```

- 不能与其他类型的值进行运算，但是能显式转为字符串，Symbol值也可以转为布尔值，但是不能转为数值。

## 属性名的遍历
- Symbol 作为属性名，该属性不会出现在for...in、for...of循环中，也不会被Object.keys()、Object.getOwnPropertyNames()、JSON.stringify()返回。
- 通过 Object.getOwnPropertySymbols 获取以symbol为key的属性

## Symbol.for()
### 有时，我们希望重新使用同一个Symbol值，Symbol.for方法可以做到这一点。它接受一个字符串作为参数，然后搜索有没有以该参数作为名称的Symbol值。如果有，就返回这个Symbol值，否则就新建并返回一个以该字符串为名称的Symbol值。

```js
Symbol.for("bar") === Symbol.for("bar")
// true

Symbol("bar") === Symbol("bar")
// false
```
## Symbol.keyFor()
### 在普通symbol中，没次调用都是新建，for则会登记，而keyFor会返回一个已登记的 Symbol 类型值的key。

```js
var s1 = Symbol.for("foo");
Symbol.keyFor(s1) // "foo"

var s2 = Symbol("foo");
Symbol.keyFor(s2) // undefined
```

