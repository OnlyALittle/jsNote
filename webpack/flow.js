const { SyncHook } = require('tapable')
const path = require('path');
const fs =require('fs');

class Compiler {
	constructor(options) { 
		this.options = options;
		// 初始化hooks
		this.hooks = {
			run: new SyncHook(),
			done: new SyncHook()
		}
	}
	run() {
		let modules = [];
		let chunks = []
		let files = []
		// 执行run hooks执行；
		this.hooks.run.call();
		// 3. 确定入口：根据配置中的 entry 找出所有的入口文件；
		let entry = path.join(this.options.context, this.options.entry);
		// 4. 编译模块：从入口文件出发，调用所有配置的 Loader 对模块进行翻译，再找出该模块依赖的模块，
		// 再递归本步骤直到所有入口依赖的文件都经过了本步骤的处理；

		// 4.1 读取模块
		let entryContent = fs.readFileSync(entry, 'utf8');
		// 4.2 调用所有配置的 Loader 对模块进行翻译,示例：babelLoader
		let entrySource = babelLoader(entryContent);
		// 模块module ->  chunk代码块 -> file bundle文件
		let entryModule = {
			id: entry,
			source: entrySource
		}
		modules.push(entryModule);
		// 4.2 把入口模块的代码转成抽象语法数，分析import和require依赖
		// 找出该模块依赖的模块，再递归本步骤直到所有入口依赖的文件都经过了本步骤的处理；
		// do something
		// .......
		//  5. 完成模块编译：在经过第4步使用 Loader 翻译完所有模块后，得到了每个模块被翻译后的最终内容以及它们之间的依赖关系；
		// 根据入口和模块之间的依赖关系，组装成一个个包含多个模块的 Chunk，
		let chunk = {
			name: 'main',
			modules
		}
		chunks.push(chunk);
		//6. 再把每个 Chunk 转换成一个单独的文件加入到输出列表，这步是可以修改输出内容的最后机会；
		let file = {
			file: this.options.output.filename,
			source: '' 
		}
		files.push(file);
		// 7.0 输出完成：在确定好输出内容后，根据配置确定输出的路径和文件名，把文件内容写入到文件系统。
		let outputPath = path.join(this.options.output.path, this.options.output.filename);
		fs.writeFileSync(outputPath, file.source, 'utf8');
		// 在以上过程中，Webpack 会在特定的时间点广播出特定的事件，插件在监听到感兴趣的事件后会执行特定的逻辑，
		// 并且插件可以调用 Webpack 提供的 API 改变 Webpack 的运行结果。
		// 执行done钩子
		this.hooks.done.call();

	}



}

// 1.初始化参数：从配置文件和 Shell 语句中读取与合并参数，得出最终的参数；
let options = require('./webpack.config.js');

//2.0 开始编译：用上一步得到的参数初始化 Compiler 对象，
let compiler = new Compiler(options);

//2.1 加载所有配置的插件，执行对象的 run 方法开始执行编译；
if (options.plugins && Array.isArray(options.plugins)) {
	for (const plugin of options.plugins) {
		plugin.apply(compiler);
	}
}
compiler.run();


// test
function babelLoader(source) {
	return source
}