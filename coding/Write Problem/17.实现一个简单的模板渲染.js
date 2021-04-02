let template = '你好，我们公司是{{company}}，我们属于{{group.name}}业务线，我们在招聘各种方向的人才，包括{{group.jobs[0]}}、{{group["jobs"][1]}}等。'

let obj = {
	group: {
		name: "支付宝xx",
		jobs: ["前端", "后端", "产品"]
	},
	company: '阿里巴巴'
}

function format(str) {
	let lIndex = -1;
	let rIndex = -1;
	let i = 0;
	let temp = {};
	while(i < str.length) {
		if (lIndex > rIndex) {
			rIndex = str.indexOf('}}', i);
			if (rIndex === -1) break;
			else {
				i = rIndex + 2;
				temp[template.substring(lIndex, i)] = 
					eval(`(() => obj.${template.substring(lIndex + 2, rIndex)})()`)
			}
		} else {
			lIndex = str.indexOf('{{', i);
			if (lIndex === -1) break;
			else i = lIndex + 2;
		}
	}

	for (let key in temp) {
		str = str.replace(key, temp[key])
	}

	return str
}

console.log(format(template))