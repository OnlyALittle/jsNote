## for in
### 遍历的是对象的属性名称(key：键名)
### 原理是: Object.keys()：返回给定对象所有可枚举属性的字符串数组
```js
    let a = ['a', 'b', 'c'];
    for (let i in a) {
        console.log(i); // 0 1 2
    }
```

## for of
### 该方法遍历的是对象的属性所对应的值(value：键值)。
### 在可迭代对象（包括 Array，Map，Set，String，TypedArray，arguments 对象等等）上创建一个迭代循环，调用自定义迭代钩子，并为每个不同属性的值执行语句
```js
    let a = ['a', 'b', 'c'];
    for (let i of a) {
        console.log(i); // a b  c
    }
```
## foreach
- return 无法打断
```js
    let a = ['a', 'b', 'c'];
    a.forEach(item => {
        console.log(i); // a b  c
    });
```
