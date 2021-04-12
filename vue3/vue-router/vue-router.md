# vue-router

## install
1. 初始化
2. 注册onBeforeRouteLeave、onBeforeRouteUpdate钩子
 - 使用`registerGuard`方法
 - 方法内部使用 onUnmounted、onDeactivated、onActivated来完成具体的内容
  ```ts
      	const removeFromList = () => {
			const index = list.indexOf(guard);
			if (index > -1)
				list.splice(index, 1);
		};
		onUnmounted(removeFromList);
		onDeactivated(removeFromList);
		onActivated(() => {
			const index = list.indexOf(guard);
			if (index < 0)
				list.push(guard);
		});
		list.push(guard);
  ```
3. 在根实例app上注册unmount，方便销毁router
4. 触发路由变化
	```ts
		push(routerHistory.location).catch(err => {
			warn('Unexpected error when starting the router:', err);
		});
	```
## matcher 路由匹配器

### createMatcher
#### 路由地址到路由对象的转换、路由记录的映射、参数处理

### addRouter

## 动态路由和嵌套路由

### 动态路由
#### 功能：
- 生成具有匹配优先级的pathList
- 生成路径/名称到路径的映射pathMap、nameMap
- 提供合并新路由记录的方法addRouters
#### 逻辑
- 遍历路由记录执行addRouterRecord
- addRouterRecord处理路由
1. path-to-regexp，path转正则
2. 嵌套时递归自身
3. 构建pathMap、nameMap
4. 遇到别名当作新记录用addRouterRecord处理

### 套路由
#### 最终还是展开的路由交由matcher匹配

## 导航守卫

### 解析流程
1. 触发
2. 失活组件调用离开钩子
3. 全局beforeEach
4. 重用组件中调用beforeRouteUpdate
5. 路由配置中的beforeEnter
6. 解析异步路由组件
7. 激活组件中的beforeRouteEnter
8. 全局beforeResolve
9. 导航确认
10. 全局afterEach钩子
11. dom更新
12. 创建好的实例调用beforeRouteEnter中的next


## 路由缓存
### 缓存的路由组件存在父级组件实例上，若启用则用父组件上的缓存实例不经过match匹配了

## router-view
- 假设这样一个场景，App.vue中写着router-view组件，其中渲染/a的a组件，/a的a组件又嵌套这/a/b 的b组件，/a/b的b组件又嵌套这/a/b/c 的c组件，形成了这样一个嵌套路由的关系，
- 每一个router-view都会把深度计算之后放入provide，在嵌套的router-view中用inject来获取并重新维护，相同的还有路由
- 那么为什么要拿到depth，const matched = route.matched[depth]，是为了配合之前的route.matched，matched会存放当前路由的record和他的父路由的record，也就是说，matched可以正确的取到当前的record。
- 然后再执行const component = matched && matched.components[name]，根据传入的name取到对应的component，最后执行return h(component, data, children)进行渲染。
```ts
const RouterViewImpl = defineComponent({
	// 省去props等
    setup(props, { attrs, slots }) {
         warnDeprecatedUsage();
        const injectedRoute = inject(routeLocationKey);
        const depth = inject(viewDepthKey, 0);
        const matchedRouteRef = computed(() => (props.route || injectedRoute).matched[depth]);
        provide(viewDepthKey, depth + 1);
        provide(matchedRouteKey, matchedRouteRef);
        const viewRef = ref();
        // watch at the same time the component instance, the route record we are
        // rendering, and the name
        watch(() => [viewRef.value, matchedRouteRef.value, props.name], ([instance, to, name], [oldInstance, from, oldName]) => {
            // copy reused instances
            if (to) {
                // this will update the instance for new instances as well as reused
                // instances when navigating to a new route
                to.instances[name] = instance;
                // the component instance is reused for a different route or name so
                // we copy any saved update or leave guards
                if (from && instance === oldInstance) {
                    to.leaveGuards = from.leaveGuards;
                    to.updateGuards = from.updateGuards;
                }
            }
            // trigger beforeRouteEnter next callbacks
            if (instance &&
                to &&
                // if there is no instance but to and from are the same this might be
                // the first visit
                (!from || !isSameRouteRecord(to, from) || !oldInstance)) {
                (to.enterCallbacks[name] || []).forEach(callback => callback(instance));
            }
        });
        return () => {
            const route = props.route || injectedRoute;
            const matchedRoute = matchedRouteRef.value;
            const ViewComponent = matchedRoute && matchedRoute.components[props.name];
            // we need the value at the time we render because when we unmount, we
            // navigated to a different location so the value is different
            const currentName = props.name;
            if (!ViewComponent) {
                return slots.default
                    ? slots.default({ Component: ViewComponent, route })
                    : null;
            }
            // props from route configuration
            const routePropsOption = matchedRoute.props[props.name];
            const routeProps = routePropsOption
                ? routePropsOption === true
                    ? route.params
                    : typeof routePropsOption === 'function'
                        ? routePropsOption(route)
                        : routePropsOption
                : null;
            const onVnodeUnmounted = vnode => {
                // remove the instance reference to prevent leak
                if (vnode.component.isUnmounted) {
                    matchedRoute.instances[currentName] = null;
                }
            };
            const component = h(ViewComponent, assign({}, routeProps, attrs, {
                onVnodeUnmounted,
                ref: viewRef,
            }));
            return (
            // pass the vnode to the slot as a prop.
            // h and <component :is="..."> both accept vnodes
            slots.default
                ? slots.default({ Component: component, route })
                : component);
        };
    },
});
```


## router-link

```ts
const RouterLinkImpl = defineComponent({
	// 省去props等
    setup(props, { slots, attrs }) {
        const link = reactive(useLink(props));
        const { options } = inject(routerKey);
        const elClass = computed(() => ({
            [getLinkClass(props.activeClass, options.linkActiveClass, 'router-link-active')]: link.isActive,
            // [getLinkClass(
            //   props.inactiveClass,
            //   options.linkInactiveClass,
            //   'router-link-inactive'
            // )]: !link.isExactActive,
            [getLinkClass(props.exactActiveClass, options.linkExactActiveClass, 'router-link-exact-active')]: link.isExactActive,
        }));
        return () => {
            const children = slots.default && slots.default(link);
            return props.custom
                ? children
                : h('a', assign({
                    'aria-current': link.isExactActive
                        ? props.ariaCurrentValue
                        : null,
                    onClick: link.navigate,
                    href: link.href,
                }, attrs, {
                    class: elClass.value,
                }), children);
        };
    },
});
```