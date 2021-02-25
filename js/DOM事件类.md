# DOM事件类

## 事件模型
- 捕获：从上到下
- 冒泡：从下到上

## 事件响应
1. 捕获
2. 目标
3. 冒泡


## 捕获流程
### 一个事件的捕获会先从 window 开始，再到 document 、html 、body 、 目标元素，冒泡反之。
```ts
const ev = document.getElementById('el')
window.addEventListener('click', () => {
    console.log('window captrue')
}, true)
document.addEventListener('click', () => {
    console.log('document captrue')
}, true)
document.documentElement.addEventListener('click', () => {
    console.log('html captrue')
}, true)
document.body.addEventListener('click', () => {
    console.log('body captrue')
}, true)
ev.addEventListener('click', () => {
    console.log('ev captrue')
}, true)
// window captrue
// document captrue
// html captrue
// body captrue
// ev captrue
```

## 事件委托
### 利用事件冒泡的机制，把监听事件绑定在父容器上

```ts
　　var oUl = document.getElementById("ul1");
　　oUl.onclick = function(ev){
　　　　var ev = ev || window.event;
　　　　var target = ev.target || ev.srcElement;
　　　　if(target.nodeName.toLowerCase() == 'li'){
　 　　　　　　 alert(123);
　　　　　　　  alert(target.innerHTML);
　　　　}
　　}

```

## Event对象常用的方法和属性
- event.preventDefault() // 阻止默认事件
- event.stopPropagation() // 阻止冒泡
- event.stopImmediatePropagation() // 阻止事件冒泡并且阻止相同事件的其他侦听器被调用
- event.currentTarget // 当前被点击的元素
- event.target // 当前所绑定的事件的元素



