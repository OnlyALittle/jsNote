### for in
```js
    let a = ['a', 'b', 'c'];
    for (let i in a) {
        console.log(i); // 0 1 2
    }
```

### for of
```js
    let a = ['a', 'b', 'c'];
    for (let i of a) {
        console.log(i); // a b  c
    }
```
### foreach
- return 无法打断
```js
    let a = ['a', 'b', 'c'];
    a.forEach(item => {
        console.log(i); // a b  c
    });
```
