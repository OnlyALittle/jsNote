# CSRF

## XSS 利用的是用户对指定网站的信任，CSRF 利用的是网站对用户网页浏览器的信任。

## 如何攻击

```html
<!-- 假设网站中有一个通过 Get 请求提交用户评论的接口，那么攻击者就可以在钓鱼网站中加入一个图片，图片的地址就是评论接口 -->
<img src="http://www.domain.com/xxx?comment='attack'" />
<!-- post -->
<form action="http://www.domain.com/xxx" id="CSRF" method="post">
  <input name="comment" value="attack" type="hidden" />
</form>
```

## 如何防御
1. Get 请求不对数据进行修改
2. 不让第三方网站访问到用户 Cookie
3. 阻止第三方网站请求接口
4. 请求时附带验证信息，比如验证码或者 token
### SameSite
- 可以对 Cookie 设置 SameSite 属性。该属性设置 Cookie 不随着跨域请求发送，该属性可以很大程度减少 CSRF 的攻击，但是该属性目前并不是所有浏览器都兼容。
### 验证 Referer
- 对于需要防范 CSRF 的请求，我们可以通过验证 Referer 来判断该请求是否为第三方网站发起的。
### Token
- 服务器下发一个随机 Token（算法不能复杂），每次发起请求时将 Token 携带上，服务器验证 Token 是否有效。