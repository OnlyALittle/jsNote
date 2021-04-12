// 一个node服务器，相当于devServer
const koa = require('koa')
const app = new koa();
const fs = require('fs')
const path = require('path')
const SFC = require('@vue/compiler-sfc');
const compilerDom = require('@vue/compiler-dom');

const resolve = (...url) => path.join(__dirname, ...url);
const nodeModulesResolve = (...url) => path.join(__dirname, '../node_modules', ...url);

// 从写import 变成相对地址
function rewriteImport(content) {
	let temp = content.replace(/ from ['"](.*)['"]/g, function(s0, s1) {
		if (s1.startsWith('/') || s1.startsWith('./') || s1.startsWith('../')) {
			// 不处理
			return s0;
		} else {
			// 裸模块
			return ` from '/@modules/${s1}'`
		}
	})
	return temp;
}

//1. 返回index.html
app.use(async ctx => {
	const { url, query } = ctx.request;
	if (url === '/') {
		const file = fs.readFileSync(resolve('index.html'), 'utf8')
		ctx.type = 'html';
		ctx.body = file;
	} else if (url.endsWith('.js')) {
		const p = resolve(url);
		const js = rewriteImport(fs.readFileSync(p, 'utf8'))
		ctx.type = 'text/javascript';
		ctx.body = js
	} else if (url.startsWith('/@modules/')){
		ctx.type = 'text/javascript';
		const moduleName = url.replace('/@modules/', '')
		const prefix = nodeModulesResolve(moduleName)
		// 文件地址
		const modulePath = require(prefix + '/package.json').module
		const filePath = path.join(prefix, modulePath)
		const content = fs.readFileSync(filePath, 'utf8');
		ctx.type = 'text/javascript';
		ctx.body = rewriteImport(content)
	} else if (/.vue/.test(url)){
		ctx.type = 'text/javascript';
		const pathVue = resolve(url.split('?')[0])
		const content = fs.readFileSync(pathVue, 'utf8');
		const ast = SFC.parse(content);
		if (!query.type) {
			const scriptContent = rewriteImport(ast.descriptor.script.content);
			const script = scriptContent.replace('export default ', 'const __script = ')
			// 转换默认导出的内容为变量
			ctx.body = `
				${script}
				// template 解析转换为另外一个请求函数
				import { render as __render } from '${url}?type=template';
				__script.render = __render
				export default __script
			`
		} else if (query.type === 'template') {
			const tpl = ast.descriptor.template.content;
			const renderCode = compilerDom.compile(tpl, { mode: 'module'}).code;
			ctx.body = rewriteImport(renderCode);
		}
	} else if (/.(png|jpg|jpeg)$/.test(url)){
		ctx.type = 'image/*';
		ctx.body = fs.readFileSync(resolve('src', url))
	}
})

app.listen(3001, () => {
	console.log('start')
});