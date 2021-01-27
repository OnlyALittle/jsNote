## Proxy 概述

下面是 Proxy 支持的拦截操作一览。

对于可以设置、但没有设置拦截的操作，则直接落在目标对象上，按照原先的方式产生结果。

### （1）get(target, propKey, receiver)

拦截对象属性的读取，比如proxy.foo和proxy['foo']。

最后一个参数receiver是一个对象，可选，参见下面Reflect.get的部分。

### （2）set(target, propKey, value, receiver)

拦截对象属性的设置，比如proxy.foo = v或proxy['foo'] = v，返回一个布尔值。

### （3）has(target, propKey)

拦截propKey in proxy的操作，以及对象的hasOwnProperty方法，返回一个布尔值。

### （4）deleteProperty(target, propKey)

拦截delete proxy[propKey]的操作，返回一个布尔值。

### （5）ownKeys(target)

拦截Object.getOwnPropertyNames(proxy)、Object.getOwnPropertySymbols(proxy)、Object.keys(proxy)，返回一个数组。该方法返回对象所有自身的属性，而Object.keys()仅返回对象可遍历的属性。

### （6）getOwnPropertyDescriptor(target, propKey)

拦截Object.getOwnPropertyDescriptor(proxy, propKey)，返回属性的描述对象。

### （7）defineProperty(target, propKey, propDesc)

拦截Object.defineProperty(proxy, propKey, propDesc）、Object.defineProperties(proxy, propDescs)，返回一个布尔值。

### （8）preventExtensions(target)

拦截Object.preventExtensions(proxy)，返回一个布尔值。

### （9）getPrototypeOf(target)

拦截Object.getPrototypeOf(proxy)，返回一个对象。

### （10）isExtensible(target)

拦截Object.isExtensible(proxy)，返回一个布尔值。

### （11）setPrototypeOf(target, proto)

拦截Object.setPrototypeOf(proxy, proto)，返回一个布尔值。

如果目标对象是函数，那么还有两种额外操作可以拦截。

### （12）apply(target, object, args)

拦截 Proxy 实例作为函数调用的操作，比如proxy(...args)、proxy.call(object, ...args)、proxy.apply(...)。

### （13）construct(target, args)

拦截 Proxy 实例作为构造函数调用的操作，比如new proxy(...args)。

### this 问题
虽然 Proxy 可以代理针对目标对象的访问，但它不是目标对象的透明代理，即不做任何拦截的情况下，也无法保证与目标对象的行为一致。主要原因就是在 Proxy 代理的情况下，目标对象内部的this关键字会指向 Proxy 代理。

```js
const target = {
  m: function () {
    console.log(this === proxy);
  }
};
const handler = {};

const proxy = new Proxy(target, handler);

target.m() // false
proxy.m()  // true
```

上面代码中，一旦proxy代理target.m，后者内部的this就是指向proxy，而不是target。

下面是一个例子，由于this指向的变化，导致 Proxy 无法代理目标对象。

```js
const _name = new WeakMap();

class Person {
  constructor(name) {
    _name.set(this, name);
  }
  get name() {
    return _name.get(this);
  }
}

const jane = new Person('Jane');
jane.name // 'Jane'

const proxy = new Proxy(jane, {});
proxy.name // undefined
```

上面代码中，目标对象jane的name属性，实际保存在外部WeakMap对象_name上面，通过this键区分。由于通过proxy.name访问时，this指向proxy，导致无法取到值，所以返回undefined。

此外，有些原生对象的内部属性，只有通过正确的this才能拿到，所以 Proxy 也无法代理这些原生对象的属性。

```js
const target = new Date();
const handler = {};
const proxy = new Proxy(target, handler);

proxy.getDate();
// TypeError: this is not a Date object.
```

上面代码中，getDate方法只能在Date对象实例上面拿到，如果this不是Date对象实例就会报错。这时，this绑定原始对象，就可以解决这个问题。

```js
const target = new Date('2015-01-01');
const handler = {
  get(target, prop) {
    if (prop === 'getDate') {
      return target.getDate.bind(target);
    }
    return Reflect.get(target, prop);
  }
};
const proxy = new Proxy(target, handler);

proxy.getDate() // 1
```

## Reflect对象的方法
Reflect对象的方法清单如下，共13个。

#### Reflect.apply(target,thisArg,args)
#### Reflect.construct(target,args)
#### Reflect.get(target,name,receiver)
#### Reflect.set(target,name,value,receiver)
#### Reflect.defineProperty(target,name,desc)
#### Reflect.deleteProperty(target,name)
#### Reflect.has(target,name)
#### Reflect.ownKeys(target)
#### Reflect.isExtensible(target)
#### Reflect.preventExtensions(target)
#### Reflect.getOwnPropertyDescriptor(target, name)
#### Reflect.getPrototypeOf(target)
#### Reflect.setPrototypeOf(target, prototype)
上面这些方法的作用，大部分与Object对象的同名方法的作用都是相同的，而且它与Proxy对象的方法是一一对应的。下面是对其中几个方法的解释。

### （1）Reflect.get(target, name, receiver)

查找并返回target对象的name属性，如果没有该属性，则返回undefined。

如果name属性部署了读取函数，则读取函数的this绑定receiver。
```js

var obj = {
  get foo() { return this.bar(); },
  bar: function() { ... }
};

// 下面语句会让 this.bar()
// 变成调用 wrapper.bar()
Reflect.get(obj, "foo", wrapper);
```

### （2）Reflect.set(target, name, value, receiver)

设置target对象的name属性等于value。如果name属性设置了赋值函数，则赋值函数的this绑定receiver。

### （3）Reflect.has(obj, name)

等同于name in obj。

### （4）Reflect.deleteProperty(obj, name)

等同于delete obj[name]。

### （5）Reflect.construct(target, args)

等同于new target(...args)，这提供了一种不使用new，来调用构造函数的方法。

### （6）Reflect.getPrototypeOf(obj)

读取对象的__proto__属性，对应Object.getPrototypeOf(obj)。

### （7）Reflect.setPrototypeOf(obj, newProto)

设置对象的__proto__属性，对应Object.setPrototypeOf(obj, newProto)。

### （8）Reflect.apply(fun,thisArg,args)

等同于Function.prototype.apply.call(fun,thisArg,args)。一般来说，如果要绑定一个函数的this对象，可以这样写fn.apply(obj, args)，但是如果函数定义了自己的apply方法，就只能写成Function.prototype.apply.call(fn, obj, args)，采用Reflect对象可以简化这种操作。

另外，需要注意的是，Reflect.set()、Reflect.defineProperty()、Reflect.freeze()、Reflect.seal()和Reflect.preventExtensions()返回一个布尔值，表示操作是否成功。它们对应的Object方法，失败时都会抛出错误。

```js
// 失败时抛出错误
Object.defineProperty(obj, name, desc);
// 失败时返回false
Reflect.defineProperty(obj, name, desc);
上面代码中，Reflect.defineProperty方法的作用与Object.defineProperty是一样的，都是为对象定义一个属性。但是，Reflect.defineProperty方法失败时，不会抛出错误，只会返回false。
```