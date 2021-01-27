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