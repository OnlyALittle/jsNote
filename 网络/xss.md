# XSS（跨站脚本攻击）

## XSS 的本质是：恶意代码未经过滤，与网站正常的代码混在一起；浏览器无法分辨哪些脚本是可信的，导致恶意脚本被执行。

## 在链接上拼接参数（值为script），之后页面取了这个参数去执行导致GG

## 常见攻击方式
- 在 HTML 中内嵌的文本中，恶意内容以 script 标签形成注入。
- 在内联的 JavaScript 中，拼接的数据突破了原本的限制（字符串，变量，方法名等）。
- 在标签属性中，恶意内容包含引号，从而突破属性值的限制，注入其他属性或者标签。
- 在标签的 href、src 等属性中，包含 javascript: 等可执行代码。
- 在 onload、onerror、onclick 等事件中，注入不受控制代码。
- 在 style 属性和标签中，包含类似 background-image:url("javascript:..."); 的代码（新版本浏览器已经可以防范）。
- 在 style 属性和标签中，包含类似 expression(...) 的 CSS 表达式代码（新版本浏览器已经可以防范）。

## XSS 攻击的预防
### 预防存储型和反射型 XSS 攻击
- 纯前端渲染
- 转义 HTML
  - 对用户生成的内容进行转义
  - 进一步的对HTML的内容（标签、文字、内容……）、CSS的内联样式、内联的JS和JSON，包括跳转的链接做

### DOM型XSS
#### 直接通过HTTP劫持，修改对应的HTML文件来实现恶意代码的注入。

### CSP
- 通过在HTTP头部添加Content-Security-Policy的字段来实现的。
- 用于限制网站资源来源，
  - 禁止加载外域代码，防止复杂的攻击逻辑；
  - 禁止外域提交，网站被攻击后，用户数据不会泄漏；
  - 禁止内联脚本执行；
  - 禁止未授权的脚本执行；
  - 通过CSP的上报功能，便于修复问题。
  
```html
<!-- 这个头的特别之处在于：它还可以放在HTML的meta标签里： -->
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; img-src https://*;">
```
```js
// 允许图片来自任意地址
Content-Security-Policy: default-src 'self' *.aa.com; img-src *
```

### HttpOnly
- 在设置Cookie的时候可以对Cookie设置该属性，该属性主要是防止Cookie被JS脚本获取，只能通过Http传输和访问。
