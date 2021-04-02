# CSS Module

## 使用
```html
// Button.js

<template>
	<button class=${styles.primary}>Submit</button>
<template>
<script>
	import styles from './App.module.css';


</script>

```

### 作用域
- 默认局部作用域
  - CSS module 生成唯一的class类名。CSS module将class转换成对应的全局唯一hash值来形成局部作用域。
  - 使用了 CSS Modules 后，就相当于给每个 class 名外加了一个 :local 这是默认的，也可以显式使用
- 全局模式
  - CSS Modules 允许使用:global(.className)的语法，声明一个全局规则。
  - 凡是这样声明的class，都不会被编译成哈希字符串。

```css
/* Button.css */
:global(.btn) {
    color: #fff;
    border: none;
    border-radius: 5px;
}

.primary {
    background-color: #1aad19;
}

/* 
与上面不加`:local`等价 
显式的局部作用域语法
*/
:local(.warn) {
    background-color: #e64340
}
```

### 样式复用
- composes
```css
/* Button.css */
.btn {
    /* 所有通用的样式 */
    color: #fff;
    border: none;
    border-radius: 5px;
    box-sizing: border-box；
}
.primary {
    composes: btn;
    composes: shadow from './author.css';
    background-color: #1aad19;
}
```

### webpack 配置
```js
{
    loader: 'css-loader',
    // loader: 'css-loader?modules',
    options: {
        modules: true,
        localIdentName: '[name]__[local]-[hash:base64:5]'
    }
}


```