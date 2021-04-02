// 页面上有三个按钮，分别为 A、B、C，点击各个按钮都会发送异步请求且互不影响，每次请求回来的数据都为按钮的名字。

// 请实现当用户依次点击 A、B、C、A、C、B 的时候，最终获取的数据为 ABCACB。

function mock(name, time) {
	return () => new Promise(resolve => {
		setTimeout(() => {
			console.log(name)
			resolve();
		}, time || 1000 * Math.random())
	})
}

class MessageList {
	_list = [];
	loading = false;

	push(task) {
		this._list.push(task)
		this.do();
	}

	do() {
		if(!this._list.length) return;
		if(this.loading) return
		this.loading = true
		let task = this._list.shift();
		task && task().finally(() => {
			this.loading = false
			this.do();
		})
	}
}

const list = new MessageList();
list.push(mock('A'))
list.push(mock('B', 3000))
list.push(mock('C'))
list.push(mock('A'))
list.push(mock('C'))

list.push(mock('B'))