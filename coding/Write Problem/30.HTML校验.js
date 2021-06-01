// 校验HTML字符串的开闭

function checkData(str) {

	const N = str.length;
	let stack = [];

	function trimLeft(i, j) {
		while (str[i] === ' ' && i < j) i++;
		return i;
	}

	// 从< 开始找到 >
	function dealTagType(i, j) {
		// 清除标签中的所有空格，在不考虑属性的情况下
		const temp = str.slice(i, j+1).replace(/\s/g, '');
        let res;
		if (temp.startsWith('</')) {
            res = dealEnd( temp )
		} else if (temp.endsWith('/>')){
            res = dealSelfEnd( temp )
		} else {
            res = dealStart( temp )
		}
        if (res === false) 
            return {
                vailRes: res
            }
        else 
            return {
                ...res
            }
	}


	function dealStart(temp) {
        let tag = temp.substring(1, temp.length - 1)
		// 拿出tag加入stack
        if (!tag) return false;
        else {
            stack.push(tag);
            return {
                type: 'start',
                tag
            }
        }
	}

	function dealSelfEnd(temp) {
		// 自闭标签

		tag = temp.substring(1, temp.length - 2)
		if (!tag) return false
		else 
			return {
				type: 'self-end',
				tag
			}
	}

	function dealEnd(temp) {
        let tag = '';
        let endStrIndex = temp.indexOf('>');
		// 拿出tag和stack最后一项比较，判断是否合规
        if (endStrIndex > -1) tag = temp.substring(2, endStrIndex)

        let lastTag = stack.pop();
        if (lastTag !== tag) return false;
        else {
            return {
                type: 'end',
                tag
            }
        }
	}

	function dealChild(i, j) {
		i = trimLeft(i, j);
		while (i < j) {
			let firstStr = str[i];
			if (firstStr === '<') {
				// 找到结束标签
				let endStrIndex = str.indexOf('>', i);
				if (endStrIndex < 0) return false;

				// 校验是否合规
				const { vailRes } = dealTagType(i, endStrIndex)
                if (vailRes === false) return false
                else 
                    // 移动指针
                    i = endStrIndex + 1;
			} else {
				i++;
			}
		}
		if (stack.length !== 0) return false;
        else return true
	}

	return dealChild(0, N);
}

let data = '<div><div><img /><p></div></p></div>'
let data2 = '<div><div></div><div ></div><p></p><span></div></span><img />'
let data3 = '<div><p><img /></p></div>'

console.log(checkData(data))
console.log(checkData(data2))
console.log(checkData(data3))