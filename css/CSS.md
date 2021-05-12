# CSS 选择器
- 简单的来说浏览器从右到左进行查找的好处是为了尽早过滤掉一些无关的样式规则和元素
- 如果从左到右，就要深层的向里递归，比较消耗性能，而现在这种情况下，可以大范围的先排除掉不匹配的

## nth-of-type 和 nth-child 区别
- `p:nth-child(2)`表示这个元素要是p标签，且是第二个子元素
- `p:nth-of-type(2)`表示父标签下的第二个p元素


# CSS 权重
### 从0开始，一个行内样式+1000，一个id选择器+100，一个属性选择器、class或者伪类+10，一个元素选择器，或者伪元素+1，通配符+0
1. 常用选择器权重优先级：!important > 内联 > id > class > tag
2. !important可以提升样式优先级，但不建议使用。如果!important被用于一个简写的样式属性，那么这条简写的样式属性所代表的子属性都会被应用上!important。 例如：background: blue !important;
3. 如果两条样式都使用!important，则权重值高的优先级更高
4. 在css样式表中，同一个CSS样式你写了两次，后面的会覆盖前面
5. 样式指向同一元素，权重规则生效，权重大的被应用
6. 样式指向同一元素，权重规则生效，权重相同时，就近原则生效，后面定义的被应用
7. 样式不指向同一元素时，权重规则失效，就近原则生效，离目标元素最近的样式被应用

# 继承
- 能 font-size font-family color
- 不能 border padding margin background-color width height等

# 盒模型（box-sizing）
- content-box：width === content width
- border-box：width === content width + padding + border

# BFC
### BFC 是什么呢
- BFC 即 Block Formatting Contexts (块级格式化上下文)，它属于上述定位方案的普通流。
- 具有 BFC 特性的元素可以看作是隔离了的独立容器，容器里面的元素不会在布局上影响到外面的元素，并且 BFC 具有普通容器所没有的一些特性。

### 触发 BFC
- body 根元素
- 浮动元素：float 除 none 以外的值
- 绝对定位元素：position (absolute、fixed)
- display 为 inline-block、table-cells、flex
- overflow 除了 visible 以外的值 (hidden、auto、scroll)

### BFC 特性及应用
1. 同一个 BFC 下外边距会发生折叠
2. BFC 可以包含浮动的元素（清除浮动）,在计算高度时会考虑浮动元素高度
3. BFC 可以阻止元素被浮动元素覆盖

# position
### position 属性规定元素的定位类型。
- position: static 
  - 默认值, 没有定位
- position: inherit 
  - 继承
- position: relative 
  - 相对定位，相对于自己的初始位置，不脱离文档流。
- position: absolute 
  - 绝对定位的元素的位置相对于最近的已定位祖先元素,定位脱离文档流
- position: fixed 
  - fixed元素脱离正常的文档流，它是固定在屏幕的某个位置，它不会随着浏览器滚动条的滚动而一起滚动。position: fixed是有兼容性问题的.
- position: sticky
  - 粘性定位，但在 css 中的表现更像是吸附

# flex
### 主轴（Main Axis）和 纵轴（Cross Axis）
- flex-direction 设置主轴
  -  column 列 row 行
- flex-wrap 用来决定超过Flex容器的宽度时换不换行
  - nowrap 不换行 wrap 换行 wrap-reverse 换行反向，就是说换行的部分显示在完整行上方
- flex-direction和flex-wrap 来决定Flex项目的分布方式。flex-flow简写
- justify-content 横向对齐方式
- justify-items 每一项横向对齐方式
- align-items 控制纵轴方向的行为
- flex 是flex-grow, flex-shrink 和 flex-basis的简写
- flex-basis 类似于min-width
- flex-grow 放大。 相对于同一行上所有其他Flex项目的大小的总和进行缩放。该值将根据指定的值自动调整
- flex-shrink 收缩，其收缩的大小是依据 flex-shrink 的值。

# transtion 和 animation的区别
不同点：

1. 触发条件不同。transition通常和hover等事件配合使用，由事件触发。animation则和gif动态图差不多，立即播放。
2. 循环。 animation可以设定循环次数。
3. 精确性。 animation可以设定每一帧的样式和时间。tranistion 只能设定头尾。 animation中可以设置每一帧需要单独变化的样式属性， transition中所有样式属性都要一起变化。
4. 与javascript的交互。animation与js的交互不是很紧密。tranistion和js的结合更强大。js设定要变化的样式，transition负责动画效果，天作之合，比之前只能用js时爽太多。
结论：
1. 如果要灵活定制多个帧以及循环，用animation.
2. 如果要简单的from to 效果，用 transition.
3. 如果要使用js灵活设定动画属性，用transition.


# rgba和opacity的区别
- opacity作用与元素，元素所有内容都透明
- rgba作用与颜色，（子元素不透明）

# opacity: 0、visibility: hidden、display: none
- display:none: 会让元素完全从渲染树中消失，渲染的时候不占据任何空间, 不能点击
- opacity: 0、visibility: hidden:不会让元素从渲染树消失，渲染元素继续占据空间，只是内容不可见，不能点击
- display: none和opacity: 0：是非继承属性，子孙节点消失由于元素从渲染树消失造成，通过修改子孙节点属性无法显示。 
- visibility: hidden：是继承属性，子孙节点消失由于继承了hidden，通过设置visibility: visible;可以让子孙节点显式。
- display：none、visibility 不支持事件监听、opacity可以，display 不能 transition 其他可以


