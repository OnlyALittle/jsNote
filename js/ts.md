# typeof, 用来获取一个变量声明或对象的类型。
```ts

interface Person {
  name: string;
  age: number;
}

const sem: Person = { name: 'semlinker', age: 30 };
type Sem= typeof sem; // -> Person

```

# keyof 操作符可以用来一个对象中的所有 key 值
```ts

interface Person {
    name: string;
    age: number;
}

type K1 = keyof Person; // "name" | "age"
```

# Partial<T> 的作用就是将某个类型里的属性全部变为可选项 ? 。
# Required<T> 的作用就是将某个类型里的属性全部变必须 。
# Pick<T, K extends keyof T> 的作用是将某个类型中的子属性挑出来，变成包含这个类型部分属性的子类型。
# Omit<T, K extends keyof any> 的作用是使用 T 类型中除了 K 类型的所有属性，来构造一个新的类型。
```ts
type Partial<T> = {
    [P in keyof T]?: T[P];
};

type Required<T> = {
    [P in keyof T]-?: T[P];
};

type Pick<T, K extends keyof T> = {
    [P in K]: T[P];
};

type Exclude<T, U> = T extends U ? never : T;
type Extract<T, U> = T extends U ? T : never;
type Omit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>;
```
