const path = require('path');
const fs = require('fs');
const { webpack, web } = require('webpack');
const webpack = require('webpack');
const { Socket } = require('dgram');
var config = {};

//1. 创建实例
let compiler = webpack(config);
//2. 启动服务
class Server {
	constructor(compiler) {
		let lastHash;
		let sockets = [];

		// 4. 添加webpack'done‘时间回调，在编译后向浏览器发消息
		compiler.hooks.done.tap('webpack-dev-server', (stats) => {
			lastHash = stats.lastHash;
			sockets.forEach((socket) => {
				socket.emit('hash', lastHash); // 先发hash值
				socket.emit('ok');
			})
		})

		let app = new express();
		// webpack以监听模式开始编译
		compiler.watch({}, (err) => {

		})

		// 用来提供编译产出的文件的静态文件服务
		const webpackDevMiddleware = (req, res, next) => {
			if (rea.url === '/favicon.ico') {
				return res.sendStatus(404);
			} else if(req.url === '/') {
				return res.sendFile(path.join(config.output.path, 'index.html'))
			}

			let filename = path.join(config.output.path, req.url.slice(1));
			try {
				let stats = fs.statSync(filename);
				if (stats.isFile()) {
					let content = fs.readFileSync(filename);
					res.header("Content-Type", mine.getType(filename));
					res.send(content);
				} else {
					next();
				}
			} catch (error) {
				return res.sendStatus(404);
			}
		}
		// 3. 配置中间件
		app.use(webpackDevMiddleware);
		this.server = require('http').createServer(app);

		// 4 使用socke.io 在浏览器端和服务端之间建立一个websocket长连接
		// 将 webpack 编译打包的各个阶段的状态信息告知浏览器端，浏览器端更加这些信息进行不同处理
		// 最主要的还是传新的模块hash值，
		let io = require('socket.io')(this.server);
		// 启动一个websocket服务器
		io.on('connection', (socket) => {
			sockets.push(socket);
			if (lastHash) {
				// 5.发生hash值
				socket.emit('hash', lastHash);
				socket.emit('ok');
			}
		})



	}
	listen(port) {
		this.server.listen(port, () => {
			console.log('port:' + port)
		})
	}




}


module.exports = new Server(compiler);

// 客户端部分
// 1. 先连socket
// 2. 监听hash
// 3. 上次没有hash（第一次）或者两次一致的话就赋值完事return
// 4. 判断哪些变化了
// 4.1 向服务器发ajax，得到一个hot-update.json
// 4.2 通过jsonp请求新代码块
// 4.3 补丁js取回来后调用webpackHotupdate方法
// 4.4 循环该模块所有的parent，在所有用到的地方执行callback 