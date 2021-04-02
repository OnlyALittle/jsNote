function instance_of(L, R) {//L 表示左表达式，R 表示右表达式 
	L = L.__proto__;  // 取 L 的隐式原型
	var O = R.prototype;   // 取 R 的显示原型 
	while (1) {
		if (L === null)
			return false;
		if (O === L)  // 当 O 显式原型 严格等于  L隐式原型 时，返回true
			return true;
		L = L.__proto__;
	}

}