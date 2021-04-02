const list = [ 
	  {id: 1, text: 'text1'}, 
	  {id: 2, text: 'text2', parentId: 1}, 
	  {id: 3, text: 'text3', parentId: 1}, 
	  {id: 4, text: 'text4', parentId: 2}, 
]; 

function toTree(data) {
	let temp = {};
	data.forEach(item => {
		let pId = item.parentId || '_s'
		if (!temp[pId]) temp[pId] = [item];
		else temp[pId].push(item);
	});

	function loop(item) {
		let children = temp[item.id];
		if (children)
			item.children = children.map(child => loop(child))
		return item;
	}


	let res = temp['_s'].map(loop)
	return res;
}

console.log(toTree(list))