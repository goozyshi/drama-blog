---
date: 2025-04-13
category: TypeScript
tags:
  - TypeScript
  - Vue
  - 泛型
spot: 巷寓
location: 深圳，海滨社区
outline: deep
---

# TypeScript 类型与 Vue 应用（下）

## TypeScript 泛型

泛型是 TypeScript 中最强大的特性之一，它允许我们创建可复用的组件，这些组件可以支持多种类型，而不仅仅是单一类型。泛型为我们提供了在保持类型安全的同时实现代码复用的能力。

### 泛型的基本概念

泛型就像是类型的函数，允许我们在定义函数、接口或类时不预先指定具体的类型，而在使用时再指定类型。

#### 泛型函数示例

让我们从一个简单的恒等函数开始：

```typescript
// 不使用泛型的写法
function identity1(arg: number): number {
  return arg;
}

// 使用any的写法 - 丢失了类型信息
function identity2(arg: any): any {
  return arg;
}

// 使用泛型的写法 - 保留了类型信息
function identity<Type>(arg: Type): Type {
  return arg;
}
```

在上面的泛型函数中，`Type`是一个类型变量，它捕获用户提供的类型，使我们可以在函数的参数和返回值之间建立类型关联。

#### 调用泛型函数的两种方式

```typescript
// 方式1：明确指定类型参数
const output1 = identity<string>("你好");

// 方式2：利用类型推断（更常用）
const output2 = identity("世界"); // TypeScript自动推断为string类型
```

在 Vue 项目中，泛型函数经常用于处理不同类型的数据：

```typescript
// 定义一个通用的数据加载函数
function useDataFetcher<T>(fetchFn: () => Promise<T>) {
  const data = ref<T | null>(null);
  const loading = ref(true);
  const error = ref<Error | null>(null);

  const loadData = async () => {
    loading.value = true;
    error.value = null;

    try {
      data.value = await fetchFn();
    } catch (e) {
      error.value = e as Error;
    } finally {
      loading.value = false;
    }
  };

  return {
    data,
    loading,
    error,
    loadData,
  };
}

// 在组件中使用
interface User {
  id: string;
  name: string;
  email: string;
}

const {
  data: user,
  loading,
  error,
  loadData,
} = useDataFetcher<User>(() => fetch("/api/user").then((r) => r.json()));
```

### 使用泛型类型变量

当你创建泛型函数时，TypeScript 会强制你在函数体内正确使用这些泛型类型：

```typescript
// 这会出错，因为不是所有类型都有length属性
function loggingIdentity<Type>(arg: Type): Type {
  console.log(arg.length); // 错误：Type上不存在length属性
  return arg;
}

// 修正：使用泛型数组类型
function loggingIdentity<Type>(arg: Type[]): Type[] {
  console.log(arg.length); // 正确，数组有length属性
  return arg;
}

// 另一种等效写法
function loggingIdentity<Type>(arg: Array<Type>): Array<Type> {
  console.log(arg.length);
  return arg;
}
```

### 泛型类型和接口

我们可以创建泛型接口和类型别名：

```typescript
// 泛型接口
interface GenericIdentityFn<Type> {
  (arg: Type): Type;
}

// 使用泛型接口
function identity<Type>(arg: Type): Type {
  return arg;
}

const myIdentity: GenericIdentityFn<number> = identity;
```

在 Vue 组件中，我们经常使用泛型接口定义响应式数据的类型：

```typescript
// 定义一个通用的表格数据接口
interface TableData<T> {
  items: T[];
  total: number;
  loading: boolean;
  page: number;
  pageSize: number;
}

// 在组件中使用
interface Product {
  id: string;
  name: string;
  price: number;
}

const tableData = reactive<TableData<Product>>({
  items: [],
  total: 0,
  loading: false,
  page: 1,
  pageSize: 10,
});
```

### 泛型类

泛型也可以用于创建类：

```typescript
class GenericCache<T> {
  private cache: Map<string, T> = new Map();

  set(key: string, value: T): void {
    this.cache.set(key, value);
  }

  get(key: string): T | undefined {
    return this.cache.get(key);
  }

  has(key: string): boolean {
    return this.cache.has(key);
  }
}

// 使用
const numberCache = new GenericCache<number>();
numberCache.set("age", 25);

const stringCache = new GenericCache<string>();
stringCache.set("name", "张三");
```

在 Vue 应用中，我们可以使用泛型类实现通用的状态管理：

```typescript
// 一个简单的状态管理类
class Store<State> {
  private state: Ref<State>;

  constructor(initialState: State) {
    this.state = ref(initialState);
  }

  getState(): Readonly<Ref<State>> {
    return readonly(this.state);
  }

  setState(newState: Partial<State>): void {
    this.state.value = { ...this.state.value, ...newState };
  }
}

// 在组件中使用
interface UserState {
  name: string;
  isLoggedIn: boolean;
  preferences: {
    theme: "light" | "dark";
    notifications: boolean;
  };
}

const userStore = new Store<UserState>({
  name: "",
  isLoggedIn: false,
  preferences: {
    theme: "light",
    notifications: true,
  },
});

// 在组件中使用
const state = userStore.getState();
const updateTheme = () => {
  userStore.setState({
    preferences: {
      ...state.value.preferences,
      theme: state.value.preferences.theme === "light" ? "dark" : "light",
    },
  });
};
```

### 泛型约束

有时我们需要限制泛型的范围，确保它具有特定的属性或方法：

```typescript
// 创建一个接口描述约束条件
interface HasLength {
  length: number;
}

// 使用extends关键字应用约束
function getLength<Type extends HasLength>(arg: Type): number {
  return arg.length;
}

// 有效调用
getLength("hello"); // 字符串有length属性
getLength([1, 2, 3]); // 数组有length属性
getLength({ length: 10 }); // 对象有length属性

// 无效调用
// getLength(123); // 错误：数字没有length属性
```

在 Vue 项目中的实际应用：

```typescript
// 定义一个要求有id属性的约束
interface Identifiable {
  id: string | number;
}

// 创建一个通用的项目选择器组件逻辑
function useItemSelector<T extends Identifiable>(
  items: T[],
  initialSelectedId?: string | number
) {
  const selectedItem = ref<T | null>(null);

  if (initialSelectedId && items.length) {
    selectedItem.value =
      items.find((item) => item.id === initialSelectedId) || null;
  }

  const selectItem = (id: string | number) => {
    selectedItem.value = items.find((item) => item.id === id) || null;
  };

  return {
    selectedItem,
    selectItem,
  };
}

// 在组件中使用
interface Product extends Identifiable {
  name: string;
  price: number;
}

const products = [
  { id: "1", name: "商品A", price: 100 },
  { id: "2", name: "商品B", price: 200 },
];

const { selectedItem, selectItem } = useItemSelector<Product>(products, "1");
```

### 在泛型约束中使用类型参数

我们可以声明一个类型参数，被另一个类型参数所约束：

```typescript
// 确保我们只获取对象上存在的属性
function getProperty<Type, Key extends keyof Type>(
  obj: Type,
  key: Key
): Type[Key] {
  return obj[key];
}

const user = {
  name: "张三",
  age: 30,
  isActive: true,
};

// 有效的调用
const userName = getProperty(user, "name");
const userAge = getProperty(user, "age");

// 无效的调用
// getProperty(user, 'email'); // 错误：user上不存在email属性
```

在 Vue 组件中应用这个模式：

```typescript
// 创建一个通用的表单字段访问器
function useField<T extends Record<string, any>, K extends keyof T>(
  form: T,
  field: K
) {
  const value = computed({
    get: () => form[field],
    set: (newValue) => (form[field] = newValue),
  });

  const resetField = () => {
    form[field] = form[field] instanceof Object ? {} : "";
  };

  return {
    value,
    resetField,
  };
}

// 在组件中使用
const formData = reactive({
  username: "",
  password: "",
  rememberMe: false,
});

// 直接使用特定字段，保证类型安全
const { value: username, resetField: resetUsername } = useField(
  formData,
  "username"
);
const { value: rememberMe } = useField(formData, "rememberMe");

// 以下代码会报错，因为email不是formData的属性
// const { value } = useField(formData, 'email');
```

### 在泛型中使用类类型

在 TypeScript 中，我们可以将类作为参数传递给泛型：

```typescript
// 创建一个工厂函数
function createInstance<T>(Constructor: new () => T): T {
  return new Constructor();
}

class User {
  name = "张三";
}

const user = createInstance(User); // 类型为User
console.log(user.name); // 输出: 张三
```

在 Vue 项目中，可以用这种方式创建组件实例或服务：

```typescript
// 一个简单的依赖注入系统
class ServiceContainer {
  private services = new Map<Function, any>();

  register<T>(Service: new (...args: any[]) => T, instance: T): void {
    this.services.set(Service, instance);
  }

  resolve<T>(Service: new (...args: any[]) => T): T {
    const service = this.services.get(Service);
    if (!service) {
      throw new Error(`服务${Service.name}未注册`);
    }
    return service;
  }
}

// 定义一些服务
class ApiService {
  baseUrl = "/api";
  fetch(endpoint: string) {
    return fetch(`${this.baseUrl}/${endpoint}`).then((r) => r.json());
  }
}

class AuthService {
  constructor(private api: ApiService) {}

  login(username: string, password: string) {
    return this.api.fetch("login");
  }
}

// 在应用中使用
const container = new ServiceContainer();
container.register(ApiService, new ApiService());
container.register(AuthService, new AuthService(container.resolve(ApiService)));

// 在组件中使用
function useAuth() {
  const authService = container.resolve(AuthService);

  const login = (username: string, password: string) => {
    return authService.login(username, password);
  };

  return { login };
}
```

### 实际应用总结

泛型在 Vue 项目中有广泛的应用，尤其在以下场景中特别有用：

1. **组合式函数(Composables)** - 创建能处理多种数据类型的可复用逻辑
2. **API 请求处理** - 为不同的 API 响应类型提供类型安全
3. **状态管理** - 实现通用的状态容器
4. **表单处理** - 创建类型安全的表单组件和验证逻辑
5. **组件 props** - 定义能接受不同数据类型的组件

通过掌握泛型，你可以编写更通用、更灵活且类型安全的代码，从而提高代码的可复用性和可维护性。

## 泛型：简单理解与实用指南

### 什么是泛型？简单比喻

泛型就像是"类型的变量"。想象你有一个装东西的盒子：

- 普通盒子只能装一种特定物品（比如只能装书）
- 泛型盒子可以装任何物品，但**一旦决定装什么，这个盒子就专门用来装这类物品**

### 为什么需要泛型？

假设我们要编写一个函数，返回数组的第一个元素：

```typescript
// 不使用泛型，只能接受数字数组
function firstElement(arr: number[]): number {
  return arr[0];
}

// 使用any，丢失了类型信息
function firstElement(arr: any[]): any {
  return arr[0]; // 返回类型是any，丢失了具体类型
}

// 使用泛型，既灵活又保留类型信息
function firstElement<T>(arr: T[]): T {
  return arr[0]; // 返回类型与数组元素类型相同
}
```

使用泛型的好处：

1. 保留类型信息（与 any 相比）
2. 灵活处理不同类型（与具体类型相比）
3. 提供编译时的类型检查

### 泛型基本用法

#### 1. 最简单的泛型函数

```typescript
// 定义
function identity<T>(value: T): T {
  return value;
}

// 使用方法1：明确指定类型
const str = identity<string>("你好");

// 使用方法2：让TypeScript自动推断类型（更常用）
const num = identity(42); // TypeScript自动推断为number类型
```

#### 2. 多个类型参数

```typescript
// 键值对函数
function pair<K, V>(key: K, value: V): [K, V] {
  return [key, value];
}

const nameAge = pair("年龄", 30); // [string, number]
const userActive = pair(101, true); // [number, boolean]
```

#### 3. 泛型接口和类型

```typescript
// 泛型接口
interface Box<T> {
  value: T;
}

const stringBox: Box<string> = { value: "一段文字" };
const numberBox: Box<number> = { value: 100 };
```

### 在 Vue 开发中的实际应用

#### 1. 状态管理

```typescript
// 简单的状态管理
function useState<T>(initialValue: T) {
  const state = ref<T>(initialValue);

  function setState(newValue: T) {
    state.value = newValue;
  }

  return [state, setState];
}

// 使用
const [name, setName] = useState("张三");
const [count, setCount] = useState(0);
```

#### 2. 组件 props

```typescript
// 列表组件
interface ListProps<T> {
  items: T[];
  renderItem: (item: T) => string;
}

// 使用组件时
defineProps<ListProps<User>>();
```

### 泛型约束：限制泛型的范围

有时我们需要限制泛型变量必须具有某些特性：

```typescript
// 约束：T必须有name属性
interface Named {
  name: string;
}

function showName<T extends Named>(obj: T): string {
  return obj.name; // 安全，因为T一定有name属性
}

// 有效调用
showName({ name: "张三", age: 30 });

// 无效调用
// showName({ age: 30 }); // 错误：缺少name属性
```

### 理解泛型的几个要点

1. **泛型不是万能的**：泛型只在类型层面工作，运行时没有泛型的概念

2. **类型参数命名**：通常用单个大写字母，如`T`、`K`、`V`等，也可用有意义的名称如`Item`、`Data`

3. **泛型与 any 的区别**：泛型在整个作用域中保持类型一致性，而 any 会丢失类型信息

4. **何时使用泛型**：当你需要函数或类处理多种不同类型，并且想保持类型信息时

希望这个简短的解释能帮助你更好地理解泛型。记住，泛型的核心目的是让你创建可重用的组件，同时保持类型安全。

## TypeScript 的 keyof 操作符

### keyof 操作符基本概念

`keyof`是 TypeScript 中一个强大的类型操作符，它作用于对象类型，返回该对象所有属性名组成的联合类型。

#### 基本用法

```typescript
// 对普通对象使用keyof
interface Person {
  name: string;
  age: number;
  location: string;
}

type PersonKeys = keyof Person;
// 结果: type PersonKeys = "name" | "age" | "location"
```

`keyof`提取的是属性名的类型，而不是属性值的类型。这个联合类型包含了对象所有的属性名。

### keyof 与不同类型的交互

#### 对象字面量类型

```typescript
type Point = { x: number; y: number };
type PointKeys = keyof Point;
// 结果: type PointKeys = "x" | "y"
```

#### 带索引签名的类型

当对象类型带有索引签名时，`keyof`的行为有所不同：

```typescript
// 使用number索引签名
type NumberIndex = { [n: number]: string };
type KeysOfNumberIndex = keyof NumberIndex;
// 结果: type KeysOfNumberIndex = number

// 使用string索引签名
type StringIndex = { [s: string]: boolean };
type KeysOfStringIndex = keyof StringIndex;
// 结果: type KeysOfStringIndex = string | number
```

注意：对于字符串索引签名，`keyof`返回`string | number`，这是因为在 JavaScript 中，对象的属性名会被强制转为字符串，所以`obj[0]`和`obj["0"]`是等价的。

#### 数字字面量属性名

当对象使用数字作为属性名时，`keyof`会返回数字字面量联合类型：

```typescript
const NumericObject = {
  1: "项目一",
  2: "项目二",
  3: "项目三",
};

// 先使用typeof获取对象的类型，然后使用keyof
type NumericKeys = keyof typeof NumericObject;
// 结果: type NumericKeys = 1 | 2 | 3
```

#### Symbol 类型属性名

TypeScript 也支持 Symbol 类型的属性名：

```typescript
const sym1 = Symbol();
const sym2 = Symbol();

const symbolObject = {
  [sym1]: "值1",
  [sym2]: "值2",
};

type SymbolKeys = keyof typeof symbolObject;
// 结果: type SymbolKeys = typeof sym1 | typeof sym2
```

因此，一个对象的属性名可能是字符串、数字或 Symbol 的组合，这就是为什么泛型约束时需要注意类型问题：

```typescript
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

// 这会导致错误，因为K可能是string|number|symbol
function useKey<T, K extends keyof T>(o: T, k: K) {
  const name: string = k; // 错误
  // Type 'string | number | symbol' is not assignable to type 'string'.
}

// 正确的写法，如果只处理字符串属性名
function useStringKey<T, K extends Extract<keyof T, string>>(o: T, k: K) {
  const name: string = k; // 正确
}
```

### 在 Vue 项目中应用 keyof

`keyof`在 Vue 项目中非常有用，尤其是处理组件 props 和响应式数据时：

```typescript
// 创建一个类型安全的属性访问函数
function useProp<T extends object, K extends keyof T>(props: T, propName: K) {
  // 返回一个计算属性，它会随props变化而更新
  return computed(() => props[propName]);
}

// 在组件中使用
interface ButtonProps {
  type: "primary" | "default" | "danger";
  size: "small" | "medium" | "large";
  disabled: boolean;
}

const props = defineProps<ButtonProps>();

// 使用我们的辅助函数
const buttonType = useProp(props, "type");
const isDisabled = useProp(props, "disabled");

// 以下会产生类型错误，因为'color'不是props的属性
// const color = useProp(props, 'color');
```

### 实际应用例子

#### 对象属性安全访问

`keyof`常用于创建类型安全的对象属性访问函数：

```typescript
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const user = {
  id: 101,
  name: "张三",
  role: "admin",
};

// 类型安全，TypeScript知道返回类型为string
const userName = getProperty(user, "name");

// 类型错误，"email"不是user的属性
// getProperty(user, "email");
```

#### 创建部分对象选择器

```typescript
function pick<T, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
  const result = {} as Pick<T, K>;
  keys.forEach((key) => {
    result[key] = obj[key];
  });
  return result;
}

const user = {
  id: 101,
  name: "张三",
  age: 30,
  email: "zhangsan@example.com",
  address: "北京市",
};

// 只选择部分属性
const basicInfo = pick(user, ["name", "age"]);
// 结果类型: { name: string; age: number }
```

#### 类型映射

`keyof`在映射类型中很常用，例如创建一个所有属性都为只读的类型：

```typescript
type Readonly<T> = {
  readonly [K in keyof T]: T[K];
};

interface User {
  id: number;
  name: string;
}

type ReadonlyUser = Readonly<User>;
// 等同于:
// type ReadonlyUser = {
//   readonly id: number;
//   readonly name: string;
// }
```

### 使用 keyof 的最佳实践

1. **泛型约束**：使用`keyof`约束泛型参数，确保只访问对象存在的属性

2. **处理多种属性类型**：记住`keyof`可能返回`string | number | symbol`，根据需要使用`Extract`等工具类型进行过滤

3. **结合 typeof 使用**：对于值，先用`typeof`获取其类型，再用`keyof`获取属性名

4. **配合映射类型**：与映射类型结合使用，可以创建强大的类型转换工具

### 总结

`keyof`操作符是 TypeScript 类型系统中的强大工具，它让我们能够：

1. 提取对象类型的所有属性名
2. 在泛型中创建类型安全的约束
3. 实现高级类型操作和转换

掌握`keyof`操作符对于编写类型安全的 TypeScript 代码至关重要，特别是在处理对象和创建通用工具函数时。

## TypeScript 的 typeof 类型操作符

### 基本概念与 JavaScript 中的 typeof 区别

在 TypeScript 中，有两种`typeof`操作符:

1. **JavaScript 的 typeof**: 在表达式上下文中使用，返回运行时类型的字符串表示
2. **TypeScript 的 typeof**: 在类型上下文中使用，返回一个变量或表达式的静态类型

```typescript
// JavaScript的typeof (表达式上下文)
console.log(typeof "Hello world"); // 输出: "string"

// TypeScript的typeof (类型上下文)
let message = "你好";
type MessageType = typeof message; // 得到类型: string
```

### typeof 的基本用法

TypeScript 的`typeof`操作符让我们能够从已有的值中提取类型信息，这在许多场景下非常有用：

```typescript
// 从对象中获取类型
const user = {
  id: 1,
  name: "张三",
  isAdmin: false,
};

type User = typeof user;
// 等价于:
// type User = {
//   id: number;
//   name: string;
//   isAdmin: boolean;
// }

// 基于这个类型创建新变量
const newUser: User = {
  id: 2,
  name: "李四",
  isAdmin: true,
};
```

### 在 Vue 项目中使用 typeof

在 Vue 项目中，`typeof`对提取复杂对象的类型特别有用：

```typescript
// 定义API响应结构
const apiResponse = {
  code: 200,
  data: {
    users: [
      { id: 1, name: "张三" },
      { id: 2, name: "李四" },
    ],
    pagination: {
      current: 1,
      total: 100,
    },
  },
  message: "success",
};

// 提取响应类型
type ApiResponse = typeof apiResponse;
// 提取用户类型
type User = (typeof apiResponse.data.users)[number];
// 提取分页类型
type Pagination = typeof apiResponse.data.pagination;

// 在组件中使用这些类型
const userData = ref<User[]>([]);
const paginationInfo = ref<Pagination>({
  current: 1,
  total: 0,
});
```

### 对函数使用 typeof

`typeof`可以获取函数的类型，包括其参数和返回值类型：

```typescript
// 定义一个函数
function formatUser(id: number, name: string) {
  return { id, name, formattedName: `用户${name}` };
}

// 获取函数类型
type FormatUserFunction = typeof formatUser;
// 类型为: (id: number, name: string) => { id: number; name: string; formattedName: string }

// 创建一个类型兼容的新函数
const enhancedFormatter: FormatUserFunction = (id, name) => {
  return {
    id,
    name,
    formattedName: `尊敬的用户${name}`,
  };
};
```

### 与 ReturnType 结合使用

`typeof`与内置的`ReturnType`工具类型结合使用特别强大，可以提取函数返回值的类型：

```typescript
function fetchUserData() {
  return {
    id: 1,
    name: "张三",
    role: "admin",
    permissions: ["read", "write", "delete"],
  };
}

// 获取函数返回值类型
type UserData = ReturnType<typeof fetchUserData>;
// 类型为:
// {
//   id: number;
//   name: string;
//   role: string;
//   permissions: string[];
// }
```

在 Vue 组件中，这可以用于提取计算属性或方法的返回类型：

```typescript
// 在组合式API中的应用
function useUserStore() {
  const user = ref({
    id: 1,
    name: "张三",
    role: "admin",
  });

  function updateUser(newName: string) {
    user.value.name = newName;
    return { success: true, timestamp: Date.now() };
  }

  return { user, updateUser };
}

// 提取返回类型
type UserStore = ReturnType<typeof useUserStore>;
// 提取更新函数的返回类型
type UpdateResult = ReturnType<UserStore["updateUser"]>;
```

### 对枚举(enum)使用 typeof

TypeScript 中的枚举在运行时会被编译成对象，使用`typeof`可以获取这个对象的类型：

```typescript
enum HttpStatus {
  OK = 200,
  NotFound = 404,
  ServerError = 500,
}

// 获取枚举的类型
type HttpStatusType = typeof HttpStatus;
// 类型类似于: { OK: number, NotFound: number, ServerError: number }

// 常见用法：与keyof结合获取枚举的键
type HttpStatusKeys = keyof typeof HttpStatus;
// 类型为: "OK" | "NotFound" | "ServerError"
```

在 Vue 项目中，我们可以优雅地使用枚举定义组件状态：

```typescript
// 定义组件状态枚举
enum ComponentStatus {
  Loading = "loading",
  Ready = "ready",
  Error = "error",
}

// 组件中使用
const status = ref<ComponentStatus>(ComponentStatus.Loading);

// 使用keyof typeof获取所有状态，用于验证
type StatusType = keyof typeof ComponentStatus;
// 用于允许的状态切换
function updateStatus(newStatus: StatusType) {
  status.value = ComponentStatus[newStatus];
}
```

### typeof 的限制

TypeScript 对`typeof`的使用有意设置了一些限制：

1. 只能对标识符(变量名)或其属性使用`typeof`
2. 不能对表达式直接使用`typeof`

```typescript
// 有效用法
function getMessage() {
  return "Hello";
}
type MessageFunction = typeof getMessage;

// 无效用法 - 会报错
type Result = typeof getMessage();
// 错误: ',' expected.
```

正确用法应该是：

```typescript
type MessageType = ReturnType<typeof getMessage>;
```

### 与类型断言的区别

不要混淆`typeof`和类型断言：

```typescript
// typeof 获取表达式的类型
const user = { name: "张三" };
type User = typeof user;

// 类型断言告诉编译器值的类型
const element = document.getElementById("app") as HTMLElement;
```

### 最佳实践

1. **提取复杂类型**：使用`typeof`从实际数据结构中提取类型，而不是手动定义

2. **与工具类型组合**：结合`ReturnType`、`Parameters`等工具类型使用

3. **减少类型重复**：当你有实现代码和需要提取类型时，使用`typeof`避免类型定义重复

4. **枚举键提取**：使用`keyof typeof Enum`获取枚举的键值联合类型

### 在 Vue 项目中的实用例子

```typescript
// 1. 提取组件props类型
const props = defineProps({
  title: { type: String, required: true },
  size: {
    type: String as PropType<"small" | "medium" | "large">,
    default: "medium",
  },
  loading: { type: Boolean, default: false },
});

// 在其他地方使用这个props类型
type ButtonProps = typeof props;

// 2. 提取事件处理器的类型
function handleSubmit(event: SubmitEvent, id: number) {
  // 处理逻辑...
}

type SubmitHandler = typeof handleSubmit;
// 类型为: (event: SubmitEvent, id: number) => void

// 3. 提取状态管理的类型
const state = reactive({
  users: [] as User[],
  selectedId: null as number | null,
  filter: {
    search: "",
    status: "active" as "active" | "inactive" | "all",
  },
});

// 提取状态类型，用于其他组件
type AppState = typeof state;
```

通过掌握`typeof`类型操作符，你可以更优雅地处理 TypeScript 中的类型推断，减少手动类型定义的工作量，同时保持类型安全。

## TypeScript 高级类型操作指南

### 1. 索引访问类型

索引访问类型允许我们通过索引获取其他类型中的特定部分。

#### 基本用法

```typescript
// 通过属性名获取属性类型
type Person = { age: number; name: string; alive: boolean };
type Age = Person["age"]; // type Age = number

// 使用联合类型作为索引
type NameOrAge = Person["name" | "age"]; // type NameOrAge = string | number

// 使用keyof获取所有属性类型
type AllValues = Person[keyof Person]; // type AllValues = string | number | boolean
```

#### 实用技巧：从数组生成联合类型

```typescript
// 创建一个只接受特定值的类型
const APPS = ["TaoBao", "Tmall", "Alipay"] as const;
type AppType = (typeof APPS)[number]; // "TaoBao" | "Tmall" | "Alipay"

// 类型安全的函数参数
function getAppAPI(app: AppType) {
  /* ... */
}
```

### 2. 条件类型

条件类型允许我们根据类型的特征选择不同的类型，类似于三元表达式。

#### 基本语法

```typescript
// 基本语法
type CheckType<T> = T extends string ? "isString" : "notString";

// 与泛型结合使用
type TypeName<T> = T extends string
  ? "string"
  : T extends number
  ? "number"
  : T extends boolean
  ? "boolean"
  : T extends undefined
  ? "undefined"
  : T extends Function
  ? "function"
  : "object";
```

#### 使用 infer 提取类型

```typescript
// 提取数组元素类型
type ArrayElementType<T> = T extends Array<infer E> ? E : never;
type NumbersType = ArrayElementType<number[]>; // number

// 提取函数返回类型
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never;
type FuncReturn = ReturnType<() => string>; // string
```

#### 条件类型的分发特性

```typescript
// 分发条件类型
type ToArray<T> = T extends any ? T[] : never;
type Result = ToArray<string | number>; // string[] | number[]

// 阻止分发
type ToArrayNonDist<T> = [T] extends [any] ? T[] : never;
type NonDistResult = ToArrayNonDist<string | number>; // (string | number)[]
```

### 3. 映射类型

映射类型允许我们基于旧类型创建新类型，通过遍历现有类型的属性。

#### 基本映射

```typescript
// 将所有属性转换为布尔类型
type OptionsFlags<Type> = {
  [Property in keyof Type]: boolean;
};

interface Features {
  darkMode: () => void;
  newUserProfile: () => void;
}

type FeaturesFlags = OptionsFlags<Features>;
// { darkMode: boolean; newUserProfile: boolean; }
```

#### 修饰符

```typescript
// 移除只读属性
type CreateMutable<Type> = {
  -readonly [Property in keyof Type]: Type[Property];
};

// 移除可选标记
type Required<Type> = {
  [Property in keyof Type]-?: Type[Property];
};
```

#### 键名重映射

```typescript
// 使用as重新映射键名
type Getters<Type> = {
  [Property in keyof Type as `get${Capitalize<
    string & Property
  >}`]: () => Type[Property];
};

interface Person {
  name: string;
  age: number;
}
type PersonGetters = Getters<Person>;
// { getName: () => string; getAge: () => number; }
```

### 在 Vue 项目中的应用

#### 类型安全的组件 Props

```typescript
// 定义可选的Props
type Optional<T> = { [P in keyof T]?: T[P] };

// 提取计算属性类型
type ComputedRef<T> = { readonly value: T };
type ExtractComputed<T> = {
  [K in keyof T]: T[K] extends ComputedRef<infer V> ? V : never;
};

// 状态切换工具
type LoadingState<T> =
  | { status: "loading" }
  | { status: "success"; data: T }
  | { status: "error"; error: string };
```

#### API 类型处理

```typescript
// 从API响应中提取数据类型
type ApiResponse<T> = {
  code: number;
  data: T;
  message: string;
};

// 提取返回值类型
type ApiData<T> = T extends ApiResponse<infer D> ? D : never;

// 创建类型安全的API客户端
type ApiClient = {
  [K in "user" | "product" | "order"]: <T>(id: string) => Promise<T>;
};
```

这些高级类型操作结合使用可以创建灵活且类型安全的代码，特别适合处理动态数据和组件状态管理。
