// Md 编译器，支持将以下转成html

// #、##、`let a = 1`、链接、图片、代码

let testStr = `
# haha
## hehe
### hehe
我是代码\`let a = 1\`
我是[链接](http://www.baidu.com)
我是图片![图片](http://www.baidu.com)

\`\`\`js
	let a  = 1;
\`\`\`
`










function parse() {
	

}

function title(str) {
	let h1 = /^(#.+)\s(.*)\n/m
	let res = str.match(h1);
	console.log(str, res)
}

title(testStr)