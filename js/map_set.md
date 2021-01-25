## Set
### 基本用法
#### ES6 提供了新的数据结构 Set。它类似于数组，但是成员的值都是唯一的，没有重复的值。

### Set 实例的属性和方法
#### Set 结构的实例有以下属性
- Set.prototype.constructor：构造函数，默认就是Set函数。
- Set.prototype.size：返回Set实例的成员总数。
#### Set 实例的方法分为两大类：操作方法（用于操作数据）和遍历方法（用于遍历成员）。下面先介绍四个操作方法。
- add(value)：添加某个值，返回 Set 结构本身。
- delete(value)：删除某个值，返回一个布尔值，表示删除是否成功。
- has(value)：返回一个布尔值，表示该值是否为Set的成员。
- clear()：清除所有成员，没有返回值。

### 遍历操作
#### Set 结构的实例有四个遍历方法，可以用于遍历成员
- keys()：返回键名的遍历器
- values()：返回键值的遍历器
- entries()：返回键值对的遍历器
- forEach()：使用回调函数遍历每个成员

## WeakSet
### WeakSet 的成员只能是对象，而不能是其他类型的值。
```js
const ws = new WeakSet();
ws.add(1)
// TypeError: Invalid value used in weak set
ws.add(Symbol())
// TypeError: invalid value used in weak set
```
### 弱引用
- 即垃圾回收机制不考虑 WeakSet 对该对象的引用，也就是说，如果其他对象都不再引用该对象，那么垃圾回收机制会自动回收该对象所占用的内存，不考虑该对象还存在于 WeakSet 之中。
- 由于上面这个特点，WeakSet 的成员是不适合引用的，因为它会随时消失。另外，由于 WeakSet 内部有多少个成员，取决于垃圾回收机制有没有运行，运行前后很可能成员个数是不一样的，而垃圾回收机制何时运行是不可预测的
### WeakSet 结构有以下三个方法。
- WeakSet.prototype.add(value)：向 WeakSet 实例添加一个新成员。
- WeakSet.prototype.delete(value)：清除 WeakSet 实例的指定成员。
- WeakSet.prototype.has(value)：返回一个布尔值，表示某个值是否在 WeakSet 实例之中

## Map
#### 它类似于对象，也是键值对的集合，但是“键”的范围不限于字符串，各种类型的值（包括对象）都可以当作键，是一种更完善的 Hash 结构实现。

### 实例的属性和操作方法
- size
- set(key, value)
- get(key)
- has(key)
- delete(key)
- clear()

### 遍历方法
- keys()：返回键名的遍历器。
- values()：返回键值的遍历器。
- entries()：返回所有成员的遍历器。
- forEach()：遍历 Map 的所有成员。
- 需要特别注意的是，Map 的遍历顺序就是插入顺序

## WeakMap
### 含义：WeakMap结构与Map结构类似，也是用于生成键值对的集合。
#### WeakMap只接受对象作为键名（null除外），不接受其他类型的值作为键名
```js
    const map = new WeakMap();
    map.set(1, 2)
    // TypeError: 1 is not an object!
    map.set(Symbol(), 2)
    // TypeError: Invalid value used as weak map key
    map.set(null, 2)
    // TypeError: Invalid value used as weak map key
```
#### WeakMap的键名所指向的对象，不计入垃圾回收机制。