# AST
### 大多数compilers分为三个步骤：
1. Parsing：解析是将原始代码转化为代码的更抽象表示。
2. Transformation：接受这个抽象表示，并操纵它做编译器想要它做的任何事情。（转译）
3. Code Generation：接受转换后的代码表示，并将其转换为新代码。


## Parsing

### 词法分析
获取原始代码，并通过词法分析器(或词法分析器)将其分解为这些称为标记（令牌）的东西。
令牌是一组很小的对象，用来描述语法的一个独立部分。它们可以是数字，标签，标点，运算符，等等。
   
### 句法分析
获取标记，并将它们重新格式化为描述语法的每个部分及其彼此关系的表示形式。
这被称为中间表示或抽象语法树。
抽象语法树(简称AST)是一个深度嵌套的对象，它以一种既易于操作又能告诉我们大量信息的方式来表示代码。

### For Example

```js
/*
 * (add 2 (subtract 4 2))
 * Tokens might look something like this:
 *   [
 *     { type: 'paren',  value: '('        },
 *     { type: 'name',   value: 'add'      },
 *     { type: 'number', value: '2'        },
 *     { type: 'paren',  value: '('        },
 *     { type: 'name',   value: 'subtract' },
 *     { type: 'number', value: '4'        },
 *     { type: 'number', value: '2'        },
 *     { type: 'paren',  value: ')'        },
 *     { type: 'paren',  value: ')'        },
 *   ]
 * 
 * AST
 *
 *   {
 *     type: 'Program',
 *     body: [{
 *       type: 'CallExpression',
 *       name: 'add',
 *       params: [{
 *         type: 'NumberLiteral',
 *         value: '2',
 *       }, {
 *         type: 'CallExpression',
 *         name: 'subtract',
 *         params: [{
 *           type: 'NumberLiteral',
 *           value: '4',
 *         }, {
 *           type: 'NumberLiteral',
 *           value: '2',
 *         }]
 *       }]
 *     }]
 *   }
 */
```

## Transformation

- 编译器的下一个阶段是转换。从上一步最后获取AST并对其进行更改。
- 同样，这只是它可以用同一种语言操作AST，也可以将AST翻译成一种全新的语言。
- AST中有看起来非常相似的元素，这些对象具有类型属性。 每个节点都被称为AST节点。
- 这些节点上定义了描述树的一个独立部分的属性。如`NumberLiteral`

### 转换AST

- 在转换AST时，我们可以通过添加/删除/替换属性来操作节点，我们可以添加新节点，删除节点，或者我们可以保留现有的AST并基于它创建一个全新的AST。
- 因为我们的目标是一种新的语言，所以我们将专注于创建一个特定于目标语言的全新AST。

## Traversal

### 遍历AST
- 为了遍历所有这些节点，我们需要能够遍历它们。这个遍历过程将以深度优先的方式遍历AST中的每个节点。
```js

 {
	type: 'Program',
	body: [{
		type: 'CallExpression',
		name: 'add',
		params: [{
			type: 'NumberLiteral',
			value: '2',
		}, {
			type: 'CallExpression',
			name: 'subtract',
			params: [{
					type: 'NumberLiteral',
					value: '4',
				}, {
					type: 'NumberLiteral',
					value: '2',
				}]
		}]
	}]
}
```
- 对于上述AST，我们可以这样做:
  1. 程序-从AST的顶层开始
  2. CallExpression (add) -移动到程序体的第一个元素
  3. NumberLiteral(2) -移动到CallExpression的参数的第一个元素
  4. CallExpression(减法)-移动到CallExpression参数的第二个元素
  5. NumberLiteral(4) -移动到CallExpression的参数的第一个元素
  6. NumberLiteral(2) -移动到CallExpression的参数的第二个元素
- 如果直接操作这个AST，而不是创建一个单独的AST，可能会在这里引入各种抽象。但是仅仅访问树中的每个节点就足够了。
- 之所以使用“访问”这个词，是因为存在这样一种模式，即如何表示对象结构元素上的操作。

## Visitors
- 创建一个“访问者”对象，该对象具有接受不同节点类型的方法
- 遍历AST时，只要“输入”一个匹配类型的节点，就会调用访问器上的方法。为了使这个更好用，还将传递节点和一个父节点的引用。
-  当我们往下走的时候，我们会到达叶子节点，当我们完成树的每个分支时，我们“退出”它。所以沿着树下去，我们“进入”每个节点，然后回到上面，我们“退出”。
```js
var visitor = {
 	NumberLiteral(node, parent) {
		enter(node, parent) {},
        exit(node, parent) {},
	 },
	CallExpression(node, parent) {},
};
```

## Code Generation
- 编译器的最后一个阶段是代码生成。
- 有时编译器会做一些与转换重叠的事情，但在大多数情况下，代码生成仅仅意味着将我们的AST和字符串化代码取出。
- 代码生成器有几种不同的方式工作,一些编译器将重用的令牌,其的会创建一个单独的代码表示，这样他们就可以线性地打印节点。
- 大多数人会使用我们刚刚创建的AST
- 实际上，代码生成器知道如何“打印”AST的所有不同节点类型，并递归地调用自己打印嵌套的节点，直到所有内容都打印到一长串代码中。

## 总结
- 并不是说每个编译器看起来都和上述的完全一样。
-  编译器有许多不同的用途，它们需要的步骤可能比这介绍的要多。
