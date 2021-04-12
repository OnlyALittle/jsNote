## 流程梳理

```ts
	const state = reactive({
		foo: 0
	})

	const comp = computed(() => {
		return state.foo;
	})

	const comp2 = computed(() => {
		return comp.foo + 1;
	})

	console.log(comp2.value);

	state.foo++;

	return {
		c2: comp2.value
	};

	// state.foo track in computed
	// computed2 执行getter Effect
	// computed 执行getter Effect
	// 把 state.foo收集到computed自己getter 的track中去
	// 把结果值赋给computed _value，标记_dirty为false（缓存）
	// 把 computed.value收集到computed2 getter 的track中去
	// 返回结果值computed
	// 把 computed2.value收集到更高层 的track中去
	// 返回结果值computed2
	// --------state.foo++;
	// computed effect被触发，标记_dirty为true（重新计算）
	// computed触发value 的trigger
	// computed2的getter接收到，重新去取computed.value
	// 。。。。。。。
	// computed2触发value 的trigger
	// 。。。。。。。
```