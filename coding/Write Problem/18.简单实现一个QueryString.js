// 简单实现一个QueryString，具有parse和stringify的能力。
// parse，用于把一个URL查询字符串解析成一个键值对的集合。
// 输入：查询字符串 'foo=bar&abc=xyz&abc=123'
// 输出：{ foo: 'bar', abc: ['xyz', '123']}
// stringify，相反的，用于序列化给定对象的自身属性，生成URL查询字符串。

let queryStr = 'foo=bar&abc=xyz&abc=123';

function queryFormat(str) {
	let strs = str.split('&');
	let query = {};
	for (const s of strs) {
		const [key, value] = s.split('=');
		if (!query[key]) {
			query[key] = value;
		} else if (Array.isArray(query[key])) {
			query[key].push(value)
		} else {
			query[key] = [query[key], value];
		}
	}
	return query;
}

console.log(queryFormat(queryStr));

