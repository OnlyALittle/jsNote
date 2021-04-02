# Generator
## C#中
- 编译器会生成一个内部类来保存上下文信息，然后将 yield return 表达式转换成 switch case，通过状态机模式实现 yield 关键字的特性。

## Js中
- 当生成器运行的时候，它会在叫做 caller 的同一个线程中运行。
- 执行的顺序是有序、确定的，并且永远不会产生并发。不同于系统的线程，生成器只会在其内部用到 yield 的时候才会被挂起。

### babel的要点是
- 一是要保存函数的上下文信息，
- 二是实现一个完善的迭代方法，使得多个 yield 表达式按序执行，从而实现生成器的特性。
- 示例代码

```js
function* test() {
  let a = 1 + 2;
  yield 2;
  yield 3;
}
let b = test();
console.log(b.next()); // >  { value: 2, done: false }
console.log(b.next()); // >  { value: 3, done: false }
console.log(b.next()); // >  { value: undefined, done: true }

function generator(cb) {
	return (function() {
	  var object = {
		next: 0,
		stop: function() {}
	  };
   
	  return {
		next: function() {
		  var ret = cb(object);
		  if (ret === undefined) return { value: undefined, done: true };
		  return {
			value: ret,
			done: false
		  };
		}
	  };
	})();
  }
  // 如果你使用 babel 编译后可以发现 test 函数变成了这样
  function test() {
	var a;
	return generator(function(_context) {
	  while (1) {
		switch ((_context.prev = _context.next)) {
		  // 可以发现通过 yield 将代码分割成几块
		  // 每次执行 next 函数就执行一块代码
		  // 并且表明下次需要执行哪块代码
		   case 0:
				a = 1 + 2;
				_context.next = 3;
				return 2;

			case 3:
				_context.next = 5;
				return 3;

			case 5:
			case "end":
          		return _context.stop();
      	}
	  }
	});
  }
  let t = test();
  t.next();
```