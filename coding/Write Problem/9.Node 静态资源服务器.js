const http = require('http');
const path = require('path');
const fs = require('fs');
const url = require('url');
const mime = require('mime')
const crypto = require('crypto');
const zlib = require('zlib');

const map = {
    "gif": "image/gif",
    "ico": "image/x-icon",
    "jpeg": "image/jpeg",
    "jpg": "image/jpeg",
    "js": "text/javascript",
    "css": "text/css",
    "html": "text/html",
    "json": "application/json",
    "pdf": "application/pdf",
    "png": "image/png",
    "svg": "image/svg+xml",
    "swf": "application/x-shockwave-flash",
    "tiff": "image/tiff",
    "txt": "text/plain",
    "wav": "audio/x-wav",
    "wma": "audio/x-ms-wma",
    "wmv": "video/x-ms-wmv",
    "xml": "text/xml"
}

const getType = (pathname) => {
    const suffix = path.extname(pathname).slice(1);//获取后缀
    const contentType = map[suffix];
	return contentType;
}

const root = path.resolve(__dirname, '../../');

function setHeader(res, code, type) {
	res.statusCode = code;
	// 资源直接进行下载
	// res.setHeader('Content-Type', 'application/octet-stream');
	res.setHeader('Content-Type', `${type};charset=utf-8`);
}

function handleCache(req, res, stats, hash) {
	// 服务器发送了etag,客户端再次请求时用If-None-Match字段来询问是否过期
	const ifNoneMatch = req.headers['if-none-match'];
	// 当资源过期时, 客户端发现上一次请求资源，服务器有发送Last-Modified, 则再次请求时带上if-modified-since
	const ifModifiedSince = req.headers['if-modified-since'];
	// http1.1内容 max-age=30 为强行缓存30秒 30秒内再次请求则用缓存  private 仅客户端缓存，代理服务器不可缓存
	res.setHeader('Cache-Control', 'private,max-age=10');
	// http1.0内容 作用与Cache-Control一致 告诉客户端什么时间，资源过期 优先级低于Cache-Control
	res.setHeader('Expires', new Date(Date.now() + 10 * 1000).toGMTString());
	// 设置ETag 根据内容生成的hash
	res.setHeader('ETag', hash);
	// 设置Last-Modified 文件最后修改时间
	const lastModified = stats.ctime.toGMTString();
	res.setHeader('Last-Modified', lastModified);
	
	// 判断ETag是否过期
	if (ifNoneMatch && ifNoneMatch !== hash) {
		return false;
	}
	// 判断文件最后修改时间
	if (ifModifiedSince && ifModifiedSince != lastModified) {
		return false;
	}
	// 如果存在且相等，走缓存304
	if (ifNoneMatch || ifModifiedSince) {
		res.writeHead(304);
		res.end();
		return true;
	} else {
		return false;
	}
}

function setCors(req, res) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, PUT, PATCH, POST, DELETE");
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With')
	const { method } = req;
	if (method === 'OPTIONS') {
		res.statusCode = 204
		res.end();
		return false;
	}
	return true;
}


function getEncoding(req, res) {
	// 看浏览器支持那种压缩
	const acceptEncoding = req.headers['accept-encoding'];
	if(/\bgzip\b/i.test(acceptEncoding)) {
		res.setHeader('Content-Encoding', 'gzip')
		return zlib.createGzip();
	} else if(/\bdeflate\b/i.test(acceptEncoding)) {
		res.setHeader('Content-Encoding', 'deflate')
		return zlib.createDeflate();
	} else {
		return null
	}
}

function getResourceStream(resourcePath, req, res) {
	let stream = fs.createReadStream(resourcePath);
	let encoding = getEncoding(req, res);
	if (encoding) {
		return stream.pipe(encoding)
	} else {
		return stream
	}
}


const app = http.createServer((req, res) => {
	if (!setCors(req, res)) return;
    const pathname = url.parse(req.url).pathname;//解析路径
	const resource = path.join(root, pathname)
	// 设置mime
	setHeader(res, 200, mime.getType(resource))

	if(fs.existsSync(resource)) {
		// 文件存在
		const stats = fs.statSync(resource);
		const hash = crypto.createHash('sha1').digest('hex');
		// 设置缓存
		if (!handleCache(req,res, stats, hash)) {
			let stream = getResourceStream(resource, req, res)
			stream.pipe(res);
		}
	} else {
		res.statusCode = 404
		res.end('Not found');
	}
})

app.listen(3000);