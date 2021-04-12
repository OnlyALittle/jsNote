# Props
### componentProps.ts

## normalizePropsOptions
- 组件实例在createComponentInstance的时候会对props进行normalizePropsOptions标准化
- 产物是[options （normalized）, needCastKeys]，options的生成是根据为Object的类型的vnode.type.props而定的
```ts

const a = {
  props: ['a-b', 'c-d']
}
// a 的输出结果
// 输出的结果
normalized = {
    'aB': EMPTY_OBJ,
    'cD': EMPTY_OBJ
}
// 输出的结果
needCastKeys = undefined

const b = {
  props: { 
    foo: Boolean,
    test: {
        type: Number,
        default: 0
    }
  }
}
// b 的输出结果
normalized = {
  foo: {
    type: Boolean
  },
  test: {
    type: Number,
    default: 0
  }
}
normalized.foo[BooleanFlags.shouldCast] = true
normalized.foo[BooleanFlags.shouldCastTrue] = true

normalized.test[BooleanFlags.shouldCast] = true
normalized.test[BooleanFlags.shouldCastTrue] = true
needCastKeys = ['foo', 'test']
```
- 当vnode.type.props的类型为Object时，needCastKeys = Object.keys(vnode.type.props)，
- 当vnode.type.props的类型为数组时，needCastKeys = vnode.type.props，
- 当然这里的key的名称都是会进行驼峰化。 

### setFullProps
- 在得到options（normalized）和needCastKeys后，存在options时，遍历vnode.props，但是跳过键`key`,`ref`
- 存在,props[camelKey] = value遍历的值
- 不存在，且不存在instance.emit或者该键key不是instance.emit的参数 attrs[key] = value
- 存在needCastKeys，遍历，value使用resolvePropValue处理

### resolvePropValue
- 根据default和value是否为空、是否为空字符串之类处理成默认值或者布尔值
- 也可能是不经过处理的value


## 初始化
### initProps
- 可以看出initProps的主要目标是依据rawProps和props options来分离出props和attrs， 
- 最终进行组件实例props和attrs的赋值；真正的解析出props发生在setFullProps函数
-  `rawProps` 经历render函数以及规范化后挂载在VNode上, `props`组件实例上的props属性最终取值, `options` 组件Props选项

### setFullProps
1. 标准化 props options，关键点是`normalizePropsOptions`
   - 通过`__props`来缓存以及标准化的props配置
2. 分离 attrs 和 props
   - 在得到标准化的组件选项后，会对传递给组件的props进行遍历，按之前所说的规则将props分离为attrs和props。
   - 不属于emit、prop的
3. 处理默认值和强制转换 `resolvePropValue`
   - 如果该props配置了默认值，并且没否被赋予初值，就从default获取默认值（支持函数和值类型）；
   - boolean casting主要可以分为两个情况：
      1. 没有传递值和配置默认值，我们需要将其手动设置成false
      2. 同时设置了Boolean和string的类型限制并且Boolean出现在String之前， 此时我们传递了""空字符串给props，按优先级别处理我们需要将props处理为true。

## 更新
- 在`updateComponentPreRender`中执行
- 更新主要分为两种情况，
  1. 编译器优化的模式
    - 优化模式下仅需要将dynamicProps存有的key对应的props更新为新的值。
  2. 全量的更新
    - 全量更新的模式下，会按照initProps的方式将新的rawProps设置一遍， 
    - 这里考虑这种情况，之前有值，现在没值了，应该设置为`undefined`,其他情况`delete`
- 这里还有触发下 `trigger(instance, TriggerOpTypes.SET, "$attrs");`


## 校验props
### validateProps
- 优先级别的，依次进行必填校验、类型校验和自定义校验器三种形式的校验来判断props的合法性。