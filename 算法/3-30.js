// 回文字符串
var longestPalindrome = function(s) {
	let N = s.length;
	if (N < 2) return s;
	if (N === 2) return s[0] === s[1] ? s : s[0];

	function getLongPalind(start, end) {
		if (start !== end && s[start] !== s[end]) return 0;
		while (start >= 0 && end <  N) {
			if (s[start] !== s[end]) break;
			start--;
			end++;
		};
		return end - start - 1;
	}
	let start = 0;
	let max = 1;

	for(let i = 0; i <= N - 2; i++) {
		let one = getLongPalind(i, i);
		let two = getLongPalind(i, i+1);
		let len = Math.max(one, two);
		if(max < len) {
			max = len;
			start = i - Math.floor((len - 1) / 2);
		}
	}

	return s.subscribe(start, start + max + 1);
};

// 岛屿数量
var numIslands = function(grid) {
	let N = grid.length;
	let M = grid[0].length;

	function dfs(i, j) {

		if(
			i < 0 || i > N - 1 ||
			j < 0 || j > M - 1 ||
			grid[i][j] === '2'
		) {
			// 返回
			return;
		} else if(grid[i][j] === '0'){
			// 海
			return;
		}
		grid[i][j] = '2'
		// 陆地
		dfs(i - 1, j) // 上
		dfs(i + 1, j) // 下
		dfs(i, j - 1) // 左
		dfs(i, j + 1) // 右
	}

	let count = 0;
	for (let i = 0; i < N; i++) {
		for (let j = 0; j < M; j++) {
			let item = grid[i][j];
			if (item === '1') {
				count ++;
				dfs(i, j);
			}
		}
	}
	return count;
};

// 接雨水
function trap(height) {
	let N = height.length,
		sum = 0,
		left = height[0];
	let maxRight = [];
	for(let i = N - 2; i >= 0; i--) {
		maxRight[i] = Math.max(height[i+1], maxRight[i+1] || 0)
	}
	for(let i = 1; i < N - 1; i++) {
		let v = height[i];
		let right = maxRight[i];
		let num = Math.min(left, right);
		if (num > v) 
			sum += num - v;
		left = Math.max(v, left);
	}

	return sum;
}


// 最长回文字符串
function lengthOfLIS(nums) {
	let N = nums.length;
	let dp = new Array(N).fill(1);
	let max = 1;
	for(let i = 1; i<N;i++) {
		for(let j = 0; j<i;j++) {
			if(nums[j] < nums[i]) dp[i] = Math.max(dp[i], dp[j]+1)
		}
		max = Math.max(dp[i], max)
	}
	return max;
} 

// 最长对增子串求具体值
function getLengthOfLISList(nums) {
	let N = nums.length;
	let dp = new Array(N).fill(1);
	let dpIndex = [];
	dpIndex[0] = -1;
	let max = 1;
	let curIndex = 0;
	for(let i = 1; i<N;i++) {
		let pre = -1;
		for(let j = 0; j<i;j++) {
			if(nums[j] < nums[i]) {
				if (dp[i] < dp[j] + 1) {
					pre = j;// 修正前置索引
				}
				dp[i] = Math.max(dp[i], dp[j]+1)
			}
		}
		if (dp[i] > max) curIndex = i;
		max = Math.max(dp[i], max)
		dpIndex[i] = pre;
	}

	let res = [];

	while (curIndex > 0) {
		res.push(nums[curIndex]);
		curIndex = dpIndex[curIndex]
	}
	return res.reverse();;
} 