// 用标记器,词法分析。
function tokenizer(input) {
	let current = 0;
	let tokens = []

	while(current < input.length) {
		let char = input[current];

		// 简单出来处理括号，不考虑先后
		if(char === '(' || char === ')') {
			tokens.push({
				type: 'paren',
				value: char
			})
			current ++;
			continue;
		}
		let WHITESPACE = /\s/;

		if(WHITESPACE.test(char)) {
			current ++;
			continue;
		}

		if (/[1-9]/.test(char)) {
			let value = '';
			while( /[0-9]/.test(char)) {
				value += char;
				char = input[++current];
			}
			tokens.push({
				type: 'number',
				value
			})
			continue
		}

		// 数字处理
		if(char === '+' || char === '-') {
			let value = char;

			char = input[++current];
			// 匹配数字，首位不能为0
			if (/[1-9]/.test(char)) {
				let value = '';
				while(/[0-9]/.test(char)) {
					value += char;
					char = input[++current];
				}
				tokens.push({
					type: 'number',
					value
				})
			} else {
				tokens.push({
					type: 'sign',
					value
				})
			}
			continue
		}

		// 字符串处理
		if (char === '"') {
			let value = '';
			char = input[++current];
			while(char !== '"') {
				value += char;
				char = input[++current];
			}
			// 此处关闭“
			char = input[++current];
			tokens.push({
				type: 'string',
				value
			})
			continue;
		}

		// 函数名称
		let LETTERS = /[a-z]/
		if (LETTERS.test(char)) {
			let value = '';
			
			while (LETTERS.test(char)) {
				value += char;
				char = input[++current];
			}
			tokens.push({
				type: 'name',
				value
			})
			continue;
		}
		throw new TypeError(`I dont kown what this character is: ${char}`)
	}
	return tokens

}
// 语法分析（AST）
function parser(tokens) {
	let current = 0;

	function walk() {
		let token = tokens[current];

		// 把每种标记类型分成不同的代码路径
		// number
		if (token.type === 'number') {
			current++;
			return {
				type: 'NumberLiteral',
				value: token.value
			}
		}

		// string
		if (token.type === 'string') {
			current++;
			return {
				type: 'StringLiteral',
				value: token.value
			}
		}

		// 处理callExpression，从`(`开始
		if(token.type === 'paren' && token.value === '(' ) {
			// 递增current来跳过括号，ast不关心他
			token = tokens[++current];

			let node = {
				type: 'CallExpression',
				name: token.value,
				params: []
			}
			token = tokens[++current]; // 方法信息已经存到node中，跳过方法名称token

			// (add 2 (subtract 4 2))
			//   [
			//     { type: 'paren',  value: '('        },
			//     { type: 'name',   value: 'add'      },
			//     { type: 'number', value: '2'        },
			//     { type: 'paren',  value: '('        },
			//     { type: 'name',   value: 'subtract' },
			//     { type: 'number', value: '4'        },
			//     { type: 'number', value: '2'        },
			//     { type: 'paren',  value: ')'        }, <<< Closing parenthesis
			//     { type: 'paren',  value: ')'        }, <<< Closing parenthesis
			//   ]

			// 开窍while 来遍历parmas
			while((token.type !== 'paren') || (token.value !== ')')) {
				node.params.push(walk());
				token = tokens[current];
			}
			current++;
			return node;
		}
		throw new TypeError(token.type);
	}

	let ast = {
		type: 'Program',
		body: [],
	}

	while(current < tokens.length){
		// current的值在walk中已经处理了
		ast.body.push(walk())
	}
	return ast;
}

// 不同Ast类型的访问机
// 现在有了AST，希望能够通过访问者访问不同的节点。 
// 当遇到具有匹配类型的节点时，我们需要能够调用访问器上的方法。
// var visitor = {
//  	NumberLiteral(node, parent) {
// 			enter(node, parent) {},
//         exit(node, parent) {},
// 	 },
// 	CallExpression(node, parent) {},
// };
function traverser(ast, visitor) {
	// 允许我们在数组上进行迭代，并调用下一个要定义的函数:' traverseNode '。
	function traverseArray(array, parent) {
		array.forEach(child => {
			traverseNode(child, parent);
		});
	}
	// 接受'节点'及其'父节点'，将两者传递给访问者方法。
	function traverseNode(node, parent) {
		let method = visitor[node.type];
		// 执行enter
		method && method.enter && method.enter(node, parent);

		// 接下来，我们将根据当前节点类型来划分内容。
		switch(node.type) {
			//我们将从我们的顶级“程序”开始。
			// 由于程序节点有一个名为body的属性，该属性包含一个节点数组，
			// 因此我们将调用' traverseArray '来向下遍历这些节点。
			// (记住，' traverseArray '将反过来调用' traverseNode '，因此我们将导致树被递归地遍历)
			case 'Program':
				traverseArray(node.body, node);
				break;

			// 接下来，我们对' CallExpression '做同样的操作，并遍历它们的' params '。
			case 'CallExpression':
				traverseArray(node.params, node);
				break;

			// 在' NumberLiteral '和' StringLiteral '的情况下，我们没有任何要访问的子节点，因此我们将中断。
			case 'NumberLiteral':
			case 'StringLiteral':
				break;
			// error.
			default:
				throw new TypeError(node.type);
		}

		// 执行exit
		method && method.exit && method.exit(node, parent);
	}
	traverseNode(ast, null);
}
/*
* 接下来是转换器。 
* 我们的转换器将获取我们已经构建的AST，并将它通过访问者传递给遍历器函数，并创建一个新的AST。
*
* ----------------------------------------------------------------------------
*   Original AST                     |   Transformed AST
* ----------------------------------------------------------------------------
*   {                                |   {
*     type: 'Program',               |     type: 'Program',
*     body: [{                       |     body: [{
*       type: 'CallExpression',      |       type: 'ExpressionStatement',
*       name: 'add',                 |       expression: {
*       params: [{                   |         type: 'CallExpression',
*         type: 'NumberLiteral',     |         callee: {
*         value: '2'                 |           type: 'Identifier',
*       }, {                         |           name: 'add'
*         type: 'CallExpression',    |         },
*         name: 'subtract',          |         arguments: [{
*         params: [{                 |           type: 'NumberLiteral',
*           type: 'NumberLiteral',   |           value: '2'
*           value: '4'               |         }, {
*         }, {                       |           type: 'CallExpression',
*           type: 'NumberLiteral',   |           callee: {
*           value: '2'               |             type: 'Identifier',
*         }]                         |             name: 'subtract'
*       }]                           |           },
*     }]                             |           arguments: [{
*   }                                |             type: 'NumberLiteral',
*                                    |             value: '4'
* ---------------------------------- |           }, {
*                                    |             type: 'NumberLiteral',
*                                    |             value: '2'
*                                    |           }]
*  (sorry the other one is longer.)  |         }
*                                    |       }
*                                    |     }]
*                                    |   }
* ----------------------------------------------------------------------------
*/
function transformer(ast) {
  let newAst = {
    type: 'Program',
    body: [],
  };

  ast._context = newAst.body;

  // We'll start by calling the traverser function with our ast and a visitor.
  traverser(ast, {

    // The first visitor method accepts any `NumberLiteral`
    NumberLiteral: {
      // We'll visit them on enter.
      enter(node, parent) {
        parent._context.push({
          type: 'NumberLiteral',
          value: node.value,
        });
      },
    },

    // Next we have `StringLiteral`
    StringLiteral: {
      enter(node, parent) {
        parent._context.push({
          type: 'StringLiteral',
          value: node.value,
        });
      },
    },

    // Next up, `CallExpression`.
    CallExpression: {
      enter(node, parent) {

        // We start creating a new node `CallExpression` with a nested
        // `Identifier`.
        let expression = {
          type: 'CallExpression',
          callee: {
            type: 'Identifier',
            name: node.name,
          },
          arguments: [],
        };
		// 接下来，我们将在原始的' CallExpression '节点上定义一个新的上下文，
		// 它将引用'表达式的实参，以便我们可以push实参。
        node._context = expression.arguments;

        if (parent.type !== 'CallExpression') {
			// 我们将用一个' ExpressionStatement '来包装' CallExpression '节点。
			// 我们这样做是因为JavaScript中的顶层' CallExpression '实际上是语句。
          expression = {
            type: 'ExpressionStatement',
            expression: expression,
          };
        }
        parent._context.push(expression);
      },
    }
  });

  return newAst;
}
// 代码生成器。
// 代码生成器将递归地调用自己来打印每个节点, newAst
function codeGenerator(node) {

	switch (node.type) {
		// 如果我们有一个' Program '节点。
		// 我们将映射' body '中的每个节点，并通过代码生成器运行它们，并使用换行符将它们连接起来。
		case 'Program':
			return node.body.map(codeGenerator)
				.join('\n');

		// 对于' ExpressionStatement '，我们将调用嵌套表达式的代码生成器，并添加一个分号…
		case 'ExpressionStatement':
			return (
				codeGenerator(node.expression) + ';' // << (...because we like to code the *correct* way)
			);
		// 对于' CallExpression '，我们将打印' callee '，
		// 添加一个开圆括号，我们将映射' arguments '数组中的每个节点，
		// 并通过代码生成器运行它们，用逗号连接它们，然后添加一个闭圆括号。
		case 'CallExpression':
			return (
				codeGenerator(node.callee) +
				' (' +
					node.arguments.map(codeGenerator)
					.join(', ') +
				')'
			);

		case 'Identifier':
			return node.name;

		case 'NumberLiteral':
			return node.value;

		case 'StringLiteral':
			return '"' + node.value + '"';
		default:
			throw new TypeError(node.type);
	}
}

/*
* every part of the pipeline.
*
*   1. input  => tokenizer   => tokens
*   2. tokens => parser      => ast
*   3. ast    => transformer => newAst
*   4. newAst => generator   => output
*/
function compiler(input) {
	let tokens = tokenizer(input);
	let ast    = parser(tokens);
	let newAst = transformer(ast);
	let output = codeGenerator(newAst);

	// and simply return the output!
	return output;	
}

//(add 2 (subtract 4 2)) ---> add (2, subtract (4, 2));
console.log(compiler('(add 2 (subtract 4 2))'))

module.exports = {
	tokenizer,
	parser,
	transformer,
	traverser,
	codeGenerator,
	compiler
}