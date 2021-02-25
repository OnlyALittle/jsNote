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
