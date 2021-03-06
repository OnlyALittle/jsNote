# loader
## 说明

## 类型
- 后置（post）
- 行内（写在require内的）
- 普通
- 前置（pre）

## loader特殊配置
- `-!` 不要前置和普通loader 
- `!` 不要普通loader 
- `!!` 不要前置和普通loader，只要内联loader

## 执行顺序
### 在编译模块节点执行
1. 按照类型分组
2. 获得绝对路径
3. 根据特殊配置进一步拿到loader list
4. 先按顺序（从左往右）走pitch，之后反向回来挨个实现loader
5. pitch有返回就立即掉头