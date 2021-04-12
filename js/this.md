# this

## 默认绑定
### 默认绑定这条规则可以看作是无法应用其他规则时的默认规则。此时 this 指向全局对象。
```ts
function foo () {
  console.log(this.name)
}
var name = '芒果'
foo() // 芒果
```

## 隐式绑定
### 函数的调用是在某个对象上触发，比如 xxx.fun()，无论有嵌套了多少层，在判断this的时候我们只需要关注最后一层，既是这个上下文对象。
```ts
function foo() {
  console.log(this.name)
}

var obj = { 
  name: '芒果', 
  foo: foo
}

obj.foo() // 芒果
```
```ts
function foo () {
  console.log(this.name)
}
var obj = {
  name: '芒果',
  foo: foo
}
var bar = obj.foo
var name = '全局芒果'
bar() // 全局芒果
setTimeout(obj.foo, 100) // 全局芒果

// setTimeout可以近似的看成
// function setTimeout(fn, delay) {
//   // 等待 delay 毫秒 
//   fn() // 默认绑定
// }

```

## 显式绑定
### 当我们使用 call()、apply()、bind() 方法调用时，我们可以明确指定 this 的绑定对象，这种方式就是显式绑定。

## new 绑定
### 这个新对象会绑定到函数调用的 this。

## 箭头函数
### 箭头函数的的 this ，在定义函数的时候绑定，继承于外部的 this 。
### 一旦绑定了上下文，就不可改变（call、apply、bind 都不能改变箭头函数内部 this 的指向）。

```ts
var name = '(个_个)'
var obj = {
  name: '芒果',
  getName: () => {
    console.log(this.name)
  }
}
obj.getName() // (个_个)


function a() {
    this.name = 1;
    obj.getName()
}
a() // 1

```
## 如何判断this
> 上面四条规则中，我们可以按照以下顺序去进行判断：

1. 函数是否在 new 中调用，如果是则 this 绑定的是新创建的对象。
2. 函数是否通过显式绑定调用，如果是则 this 绑定的是指向的对象。
3. 函数是否在某个上下文对象中调用（隐式调用），如果是则 this 绑定的是上下文对象。
4. 如果以上都不是，则使用默认绑定。
5. 如果是箭头函数，箭头函数的 this 继承的是上一层代码块的this。





