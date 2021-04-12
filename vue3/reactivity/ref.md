# [ref](https://v3.cn.vuejs.org/api/refs-api.html#ref)

## createRef

### ref的出现是为了包装基本类型以实现代理，API形态也有所展现，通过.value来进行访问和修改，那我们直接看到ref函数：

### ref的handler都是在ref内部实现，因为他不是包proxy的

### 核心是createRef中用到的RefImpl Class

```ts

class RefImpl<T> {
  private _value: T

  public readonly __v_isRef = true

  constructor(private _rawValue: T, public readonly _shallow = false) {
    //+ 把对象直接处理成reactive
    //+ _shallow模式下，传入的一定是obj，但是refImpl只会监听对象的value，所以其他值不会响应式
    //+ shallowRef创建一个跟踪自己的 .value 更改的ref
    this._value = _shallow ? _rawValue : convert(_rawValue)
  }

  get value() {
	  // 实现类似proxy的拦截，收集依赖
    // 监听value 这个key，因为ref只能通过value访问
    track(toRaw(this), TrackOpTypes.GET, 'value')
    return this._value
  }

  set value(newVal) {
    // 比较两者的源值
    if (hasChanged(toRaw(newVal), this._rawValue)) {
	  this._rawValue = newVal
	  // 对象则直接当reactive封装
      this._value = this._shallow ? newVal : convert(newVal)
      //+ 触发收集了的依赖
      trigger(toRaw(this), TriggerOpTypes.SET, 'value', newVal)
    }
  }
}

```

## shallowRef
### _shallow模式下，传入的是对象，但是refImpl只会监听对象的value，所以其他值不会响应式，见RefImpl的constructor


## toRefs
```ts
//+ 递归解响应式
  const ret: any = isArray(object) ? new Array(object.length) : {}
  for (const key in object) {
    ret[key] = toRef(object, key)
  }
  return ret
```

## customRef
### 核心是createRef中用到的CustomRefImpl Class

```ts

type CustomRefFactory<T> = (
  track: () => void,
  trigger: () => void
) => {
  get: () => T
  set: (value: T) => void
}

class CustomRefImpl<T> {
  private readonly _get: ReturnType<CustomRefFactory<T>>['get']
  private readonly _set: ReturnType<CustomRefFactory<T>>['set']

  public readonly __v_isRef = true

  // 提供依赖收集和触发的方法，逻辑由函数自己控制
  constructor(factory: CustomRefFactory<T>) {
    const { get, set } = factory(
      () => track(this, TrackOpTypes.GET, 'value'),
      () => trigger(this, TriggerOpTypes.SET, 'value')
    )
    this._get = get
    this._set = set
  }

  get value() {
    return this._get()
  }

  set value(newVal) {
    this._set(newVal)
  }
}

```
### For examples

```ts
function useDebouncedRef(value, delay = 200) {
  let timeout
  return customRef((track, trigger) => {
    return {
      get() {
        track()
        return value
      },
      set(newValue) {
        clearTimeout(timeout)
        timeout = setTimeout(() => {
          value = newValue
          trigger()
        }, delay)
      }
    }
  })
}
```
