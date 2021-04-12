# this
## 当前环境执行期上下文对象的一个属性
## this在不同的环境、不同的作用下表现不同
## this基本原则：谁调用this的宿主，this就指向谁
- 全局作用域下的this -> 全局 （window/global）
  - 全局`var`声明会挂载在window下
  - 但是在node环境下需要手动使用global.xx去挂载，默认不会自动挂载
  - 可以使用globalThis 去适应不同环境
  - 严格模式下指向全局的this -> undefiend
- 箭头函数，
  - 静态this指向，在定义时决定
  - 不是谁绑定指向谁，只指向外层有效作用域的this指向
- 
- 直接调用：`fn()` -> 全局
- 对象方法调用: `a.b.fn()` -> 指向b，最近作用域引用
```ts
let a = {
	a:1,
	test: function() {
		function t() {
			console.log(this) // window
		}
		t()
	}
}
```

# arguments
- 类数组对象而不是数组
- 存在length属性

## 题目
### 提升
	```ts
		(function() {
			var x = y = 1; //这个地方的提升有坑
			// var x;
			// y = 1;
			// x = 1;
		})()
		console.log(y) // 1
		console.log(x) // err
	```
- 
### 箭头函数的this
- 箭头函数的this指向定义时的位置
```ts
	let obj1 = {
		name: 'obj1',
		print: function() {
			return () => console.log(this.name)
		}
	}
	let obj2 ={name: 'obj2'}
	obj1.print()(); // obj1
	obj1.print().call(obj2); // obj1
	obj1.print.call(obj2)(); // obj2
```

### 立即执行函数的函数名相当于常量定义 即const定义。
```ts
;(function b() {
  b = 123
  console.log(b)
})()
// b函数
```
- 立即执行函数的函数名相当于常量定义 即const定义。
- 若进行赋值 所以非严格模式下 会无法给它赋值， 严格模式下会报错
###  this指向
```ts
let length = 10
function fn() {
  console.log(this.length);
}
let obj = {
  length: 5,
  method(fn) {
    // 两次调用各输出什么
    fn()
    arguments[0](0)
  }
}
obj.method(fn, 1)
```
- 第一次输出 0，因为 this 指向全局上下文，即为 window, 
- 而 let length 不会去改window，window.length 代表当前 iframe 数量，默认为 0
- 第二次输出 2，因为 this 指的是 arguments 参数对象，
- 而 .method(fn, 1)，故 arguments.length 为形参的数量 2