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