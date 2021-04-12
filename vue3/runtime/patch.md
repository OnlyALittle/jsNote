# patch
> patch方法是Vue中进行VNode操作的重要方法，被称作是打补丁方法，是进行VNode递归挂载和diff的递归函数。
## patch 的核心是做组件处理逻辑的分发，根据VNode类型的判断来确定下一步需要具体执行的子逻辑
- 如果不是相同类型的节点（type、key都相同才算相同节点），直接卸载旧的vnode
- 遇到 `PatchFlags.BAIL` PatchFlags就停止diff优化
- 根据不同的类型分发到不同函数中去执行
  - 这边特殊说明下static vnode 静态节点的处理优化，把它字符串化减少深层遍历
- 每次patch都要重新设置ref，这也就是为什么在编译阶段不对含有ref的节点进行提升的原因，因为ref是当作动态属性来看待的

## processComponent
- 依旧拆分了逻辑
- `mountComponent`，`updateComponent`，`keep alive 的 active`


### mountComponent
> 1. 创建组件实例
> 2. 启动组件 setup
> 2. 创建带副作用的 render 函数
- createComponentInstance 创建instance，一个组件相关的Object。
- 为keepAlive注入渲染器内部组件
- setupComponent，对instance.attrs、vnode.type.setup和vnode.type中的所有关键OPTIONS字段的处理。
- 启动带副作用的render函数setupRenderEffect，处理instance.render、instance.vnode.type、instance.subTree、
- 更新组件的effect和instance.subTree.props合并instance.attrs。

```ts
// 创建组件实例
  const instance: ComponentInternalInstance = (initialVNode.component = createComponentInstance(
    initialVNode,
    parentComponent,
    parentSuspense
  ));
  // 启动组件setup
  // 对instance.attrs、vnode.type.setup和vnode.type中的所有关键OPTIONS字段的处理。
  setupComponent(instance);
  // setup函数为异步的相关处理 忽略相关逻辑
  if (__FEATURE_SUSPENSE__ && instance.asyncDep) {
    parentSuspense.registerDep(instance, setupRenderEffect);
    if (!initialVNode.el) {
      const placeholder = (instance.subTree = createVNode(Comment));
      processCommentNode(null, placeholder, container!, anchor);
    }
    return;
  }
  // 启动带副作用的render函数
  setupRenderEffect(
    instance,
    initialVNode,
    container,
    anchor,
    parentSuspense,
    isSVG,
    optimized
  );

```


### updateComponent
- 判断是否需要更新，如果需要更新就执行更新
- 但是在更新之前他会先去除queueCb中的更新
- 因为effect中可能会自执行

### shouldUpdateComponent 
- 组件是否需要更新
1. 包含指令和transition的需要更新
2. 优化模式模式下
   1. 动态插槽情况
   2. FULL_PROPS情况下，判断props变没变
   3. 动态props每一项比较，排除emit
3. 其他情况（这种情况属于说，组件的render是自己写的而不是template）
   1. 有自组件的话就update
   2. 不然就还是判断prop

### createComponentInstance 创建组件实例
```ts
  // 继承自父组件的appContext，如果是根组件VNode从根VNode中取得
  const appContext =
    (parent ? parent.appContext : vnode.appContext) || emptyAppContext
  // 通过对象字面量创建instance
  const instance: ComponentInternalInstance = {...}
  instance.ctx = { _: instance }
  instance.root = parent ? parent.root : instance
  instance.emit = emit.bind(null, instance)
  return instance
```

### setupComponent
- 初始化props和slots
- 然后执行setup函数或者是兼容options API得到最终instance的state； 


### setupRenderEffect
- 在mount内部得到了完整的instance、props、slots、state等就能开始render了
- 执行的内容被包裹在一个effect中
- 同时注意`onVnodeMounted`和`mounted`将在此时被推入`queuePostCbs`中去
```ts
// 创建执行带副作用的渲染函数并保存在update属性上
instance.update = effect(function componentEffect() {
  if (!instance.isMounted) {
    // 未挂载的情况
    let vnodeHook: VNodeHook | null | undefined
    const { el, props } = initialVNode
    const { bm, m, a, parent } = instance
    // 以当前组件为根渲染子节点，核心是通过组件的render函数来得到组件子树，
    const subTree = (instance.subTree = renderComponentRoot(instance))
    // 递归，patch子树
    patch(...)

    // onMounted
    if (m) {
      queuePostRenderEffect(m, parentSuspense)
    }
    // onVnodeMounted
    queuePostRenderEffect(() => {
      invokeVNodeHook(vnodeHook!, parent, scopedInitialVNode)
    }, parentSuspense)

    // 挂载后处理
    initialVNode.el = subTree.el
    instance.isMounted = true

  } else {
    // 更新组件
    // 组件自身发起的更新 next 为 null
    // 父组件发起的更新 next 为 下一个状态的组件VNode
    let { next, vnode } = instance;
    let originNext = next;

    if (next) {
      // 如果存在next 我们需要更新组件实例相关信息 修正instance 和 nextVNode相关指向关系
      // 更新Props和Slots
      updateComponentPreRender(instance, next, optimized);
    } else {
      next = vnode;
    }
    // 渲染新的子树
    // 下一个状态的组件VNode.component指向实例
    const nextTree = renderComponentRoot(instance);
    const prevTree = instance.subTree;
    instance.subTree = nextTree;
    next.el = vnode.el;
    // diff子树
    patch(
      prevTree,
      nextTree,
      // 排除teleport的情况，即时获取父节点
      hostParentNode(prevTree.el!)!,
      // 排除fragement情况，即时获取下一个节点
      getNextHostNode(prevTree),
      instance,
      parentSuspense,
      isSVG
    );
    next.el = nextTree.el;
  }
}, effectOptions)
```

### renderComponentRoot 
- 核心是通过组件的render函数来得到组件子树，
- 更新主要在处理新VNode和instance关系上以及更新与父组件强相关的属性props和slots； 这样其实也更好理解父组件触发的子组件更新为何需要一个新的组件VNode。
- 处理完组件的最新信息后，也就可以通过renderComponentRoot拿到新的组件子树，这个函数以及在挂载篇章解析了， 主要是通过调用组件render函数来渲染得到新子树。我们直接到下一个步骤patch subTree。


## processElement
- 依旧拆分了逻辑
- `mountElement`，`patchElement`


### mountElement
- `PatchFlags.HOISTED` 静态提升的节点直接 `el = vnode.el = hostCloneNode(vnode.el)`
- 其他的就创建 `hostCreateElement`
- 之后分情况处理 children
- 执行指令的钩子
- 处理Props
- 将元素插入 Dom 中

```ts
// 1.依据元素类型使用平台创建元素函数创建el 
// 1.1 `PatchFlags.HOISTED` 静态提升的节点直接 `el = vnode.el = hostCloneNode(vnode.el)`
if (。。。 patchFlag === PatchFlags.HOISTED) {
  el = vnode.el = hostCloneNode(vnode.el)
} else {
  el = vnode.el = hostCreateElement(。。。)
}
if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
  // 2.1 TEXT_CHILDREN类型直接设置 文本节点的children
  hostSetElementText(el, vnode.children as string)
} else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
  // 2.2数组型的children
  mountChildren(。。。)
}

// 3.1 指令 created 钩子
// 4 处理props
// 4.1 处理element 原生的一些属性
// 4.2 处理 onVnodeBeforeMount 钩子
if (props) {
    for (const key in props) {
      hostPatchProp（。。。）
      if ((vnodeHook = props.onVnodeBeforeMount)) {
        invokeVNodeHook(vnodeHook, parentComponent, vnode)
      }
    }
}
// 设置ScopeId
setScopeId(el, scopeId, vnode, parentComponent)
}
// 3.2 指令 beforeMount 钩子

// 5 触发transition 的 beforeEnter
// 6 插入dom
// 7 把VNode和指令的hooks推入queuePostCbs
```


### mountChildren
- mountChildren对于children直接采用遍历的方式来逐个patch这样也产生了递归关系， 
- 接下来我们看看hostPatchProp这个方法来自 runtime-dom/patchProp.ts中，都是一些关于原生 Dom 元素的属性的操作就不再展开。 当当前的元素生成后就是插入 Dom 的时机了，调用的也是 web 平台的insertBefore或者appendChild； 感兴趣的可以在 runtime-dom/(nodeOps|patchProp).ts中详细了解Web平台相关的渲染 API

### patchElement
1. 执行指令beforeUpdate钩子，执行vnode钩子onVnodeBeforeUpdate
2. `FULL_PROPS` 节点包含动态属性，使用 `patchProps` 对属性做全量diff，
3. 对prop进行 `hostPatchProp`
4. 动态文本变化，直接重新设置新文本
5. 不走优化diff，全量diff `patchProps`
6. 更新补丁后的钩子onVnodeUpdated触发
   - 注意：不是立即触发，放入postQueueCb
   - vue中的更新钩子是 由scheduler调度器来控制执行时机的，effect先入队，在flash时执行
7. 子节点的 `patchChildren`
    - block节点，忽略层级对dynamicChildren进行比对即可，
    - dynamicChildren包含了block树中所有的动态子代节点或子代block，因此无需再比对children
    - 不优化走children的全量diff
8. 
  
### patchChildren
- patch自组件的vnode，分几种情况
1. 部分或全部子节点标记key的diff，`patchKeyedChildren`
2. 全部子节点均未标记key的diff，`patchUnkeyedChildren`
3. 文本, 数组或无子节点的情况
    - 旧子节点是数组卸载，`unmountChildren` 

## patchUnkeyedChildren
### patch 对比那些没有用key标记的子节点
### 比较逻辑
```ts
// <div v-for="(item, index) in list">{{ item }}</div>
```
1. 取新旧子节点数组的最小长度，保证新旧子节点两两比较不会为空
2. patch newVNode 中 commonLength的部分
3. 如果说oldVNode长度比较长，就删除（unmountChildren）超出部分
4. 如果说newVNode长度比较长，就创建挂载（mountChildren）超出部分

---- 
## patchKeyedChildren
### patch 对比那些有key标记的子节点
### 比较逻辑,按序向下处理
1. 从头部向后比较
2. 从尾部向前比较
3. 还有剩下的就在分三种情况处理
   1. 旧children完了，挂载新的
   2. 新children完了，卸载旧
   3. 还有剩余，说明是在中间，存在未知序列，参见case5
```ts
	// <div v-for="(item, index) in list" :key="`${item}-${index}`">{{ item }}</div>
	// i，头部推进指针；e1，oldNode尾部指针推进 e2，newNode尾部指针推进
```
- case1:
```ts
// case 1
// (a b) c
// (a b) d e
```
  1. 我们先从节点组头部向尾部遍历，遇到尾指针则停止。
  2. 遍历过程中，遇到相似节点（tag、key均相等）直接patch比对，否则退出遍历，
  3. 此时`i`记录了diff最新的头部推进指针
   
- case2:
```ts
// case 1
// a (b c)
// d e (b c)
```
  1. 尾部向头部遍历,从节点组尾部向头部遍历，只要有一个尾指针遇到指针`i`则停止。
  2. 遍历过程中，遇到相似节点（tag、key均相等）直接patch比对，否则退出遍历，
  3. 此时e1，e2,记录了diff最新的尾部推进指针

- case3:
```ts
// (a b)
// (a b) c
// 此时：i = 2, e1 = 1, e2 = 2
// (a b)
// c (a b)
// 此时：i = 0, e1 = -1, e2 = 0
```
  1. 经过上面（case1、case2）的首尾夹逼操作后，两个方向至少有一个遍历没有中途断掉，那么首尾指针便会相撞。
  2. 首先考虑该case，旧节点组均经过patch操作，新节点组中间部分存在断档，因此当作新增节点进行挂载操作
  3. 判断是不是已经超过了当前最长值，决定操作的锚点是上一个兄弟节点还是父节点
  4. 对没有patch过的新的节点计算patch

- case4:
```ts
// (a b) c
// (a b)
// i = 2, e1 = 2, e2 = 1
// a (b c)
// (b c)
// i = 0, e1 = 0, e2 = -1
```
  1. 旧节点组首尾指针未相撞，新节点组首尾指针相撞，与case3相反
  2. unmount，卸载这些节点
- case5: 存在未知序列
```ts
[i ... e1 + 1]: a b [c d e] f g
[i ... e2 + 1]: a b [e d c h] f g
i = 2, e1 = 4, e2 = 5
```
  1. 遍历新VNode未知序列，记录新序列中节点的key - index键值对，存入keyToNewIndexMap
  2. 循环遍历尚未patch的old VNode，并尝试patch匹配的节点&删除不再存在的节点
     1. 初始化新旧节点对应关系表，因为只记录index对应关系，所以用数组来当作map来记录，用数组`newIndexToOldIndexMap`记录也是为了用于创建最长稳定子序列。
        - 0为初始值，即表示新节点无对应的旧节点
     2. 如果旧节点携带有效的key值，通过之前生成的新序列key-index映射表，检索到含有相同key新节点的index `newIndex`
     3. 对于不携带key的旧节点，尝试在新节点序列中找出一个同样不携带key且为相似节点的新节点，并记录对应新节点的index `newIndex`
        - 只有找到旧节点对应的新节点才会执行patch并为patched计数，因此一旦patched === toBePatched，说明新序列的节点全部patch完毕，旧节点中新访问到的节点不可能在有对应的新节点了，因此直接卸载对应就节点即可
     4. newIndex为空，说明未找到与旧节点相对应的新节点，直接卸载oldVNode 没有 patch的部分
     5. 之后处理存在的情况，新旧节点对应关系表中，记录新节点index对应的旧节点index，
     6. 记录是否需要做节点移位操作，如何发现节点是否移位了呢，
     	- 在遍历patch过程中，每次patch都记录下最大的新节点index，
     	- 其实也就是上一次的newIndex，如果每次记录的newIndex都保证比上次大，
     	- 那么新旧序列中前后两个节点的相对位置是没有发生变化的，反之则标记需要移位，因为节点的相对位置变了，
		```ts
			// 比如这样：
			// (a b) c
			// (a c b)
			// b在新旧序列中相对a的位置都是在后面，
			// 至于中间插进来的c,在新旧序列对比b、c的时候，
			// 由于c最新对应的newIndex已经小于b对应的newIndex，因此会记录需要移位
		```
     7. 新旧点点相对应，做patch操作
     8. 做节点的移位操作和新增节点挂载操作，当需要发生节点位移时，生成最长稳定子序列，用于确定如何位移
     9. 从新序列尾部向前遍历，目的是能够使用上一个遍历的节点做锚点
     10. 确定锚点，如果是完整序列最后一个节点，anchor为父节点对应的anchor，否则就是上一个子节点
     11. 如果newIndexToOldIndexMap对应的值为0，说明新节点没有对应的旧节点，毫无疑问是新增节点，直接挂载
     12. 如果是需要移位的操作，节点的位移操作，新子节点序列和最长稳定子序列都是由尾部向前遍历， 位移发生的条件:
       - moved标志位为true
       - 最长稳定子序列为空，比如节点组反转的case，（j < 0）
       - 最长稳定子序列当前值和当前访问的新节点index不相同
     13. 将需要移位的新节点dom元素移位到anchor前面，最终的移位的结果就是两元素在dom中的位置和在vnode中的位置完全一致
     14. 不移位就前移j指针





