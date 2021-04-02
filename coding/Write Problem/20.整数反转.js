let data = -123123123;

function reverse(num) {
	let nums = num.toString().split('');
	let f = '';
	if (nums[0] === '-') f = nums.splice(0,1);
    var str= nums.reverse().join('')
    str = parseInt(f+str)
    if(str>2**31-1) return 0
    return str;

}

console.log(reverse(data));
