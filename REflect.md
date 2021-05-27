Reflect
## 概述


## 静态方法
1. Reflect.get(target, name, receiver)
2. Reflect.set(target, name, value, receiver)
3. Reflect.has(obj, name)
4. Reflect.deleteProperty(obj, name)
5. Reflect.construct(target, args)
6. Reflect.getPrototypeOf(obj)
7. Reflect.setPrototypeOf(obj, newProto)
8. Reflect.apply(func,thisArg, args)
9. Reflect.defineProperty(target, propertyKey, attributes)
10. Reflect.getOwnPropertyDescriptor(target, propertyKey)
11. Reflect.isExtensible(target)
12. Reflect.preventExtensions(target)
13. Reflect.ownKeys(target)

+ Reflect.get(target, name, receiver)
  - Reflect.get方法查找并返回target对象的name属性，如果没有该属性，则返回undefined
  - 如果name属性部署了读取函数（getter)，则该读取的函数的this绑定receiver
  - 如果第一个参数不是对象，Reflect.get方法会报错
+ Reflect.set(target, name, value, receiver)
  - Reflect.set方法设置target对象的name属性等于value
  - 如果name属性设置了赋值函数，则赋值含的this绑定receiver
  - 如果Proxy.set拦截里面使用了Reflect.set，并且传入receiver,会导致触发Proxy.defineProperty拦截
  - 如果第一个参数不是对象，Reflect.set会报错
+ Reflect.has(obj, name)
  - Reflect.has方法对应name in obj 里面的in运算
  - 如果第一个参数不是对象，会报错
+ Reflect.deleteProperty(obj, name)
  - 等同于delete obj[name], 用于删除对象的属性
  - 该方法返回一个布尔值，如果删除成功，或者被删除的属性不存在，返回true;删除失败，被删除的属性依然存在，返回false
  - 第一个参数不是对象，报错
+ Reflect.construct(target, args)
  - Reflect.construct方法等同于new target(...args),这提供了一种不使用new,来调用构造函数的方法
  - 第一个参数不是函数，会报错
+ Reflect.getPrototypeOf(obj)
  - 方法用于读取对象的__ proto __ 属性，对应Object.getPrototypeOf(obj)
  - 与Object.getPrototypeOf(obj)的区别就是
    - Reflect.getPrototyepOf(obj)的参数如果不是一个对象，会报错
    - Object.getPrototypeOf(obj)的参数如果不是一个对象， 会转为对象，然后运行
+ Reflect.setPrototypeOf(obj, newProto)
  - 用于设置目标对象的原型（prototype)，对应Object.setPrototypeOf(obj, newProto)方法，返回一个布尔值，表示是否设置成功
  - 如果无法设置目标对象的原型（比如，目标对象禁止扩展），Reflect.setPrototypeOf方法返回false
  - 与Object.setPrototypeOf(obj)的区别就是
    1. Reflect.setPrototyepOf(obj)的参数如果不是一个对象，会报错；
    Object.setPrototypeOf(obj)的参数如果不是一个对象，会返回第一个参数本身
    2. 如果第一个参数是undefined或null，两个都会报错
+ Reflect.apply(func,thisArg, args)
  - 等同于Function.prototype.apply.call(func, thisArg, args),用于绑定this对象后执行给定函数
+ Reflect.defineProperty(target, propertyKey, attributes)
  - 基本等同于Object.defineProperty,用来为对象定于属性, _未来后者会被逐渐废除_
  - 第一个参数不是对象，会报错
+ Reflect.getOwnPropertyDescriptor(target, propertyKey)
  - 基本等同于Object.getOwnPropertyDescriptor,用于得到指定属性的描述对象，_将来会替代掉后者_
  - 第一个参数不是对象，会报错
+ Reflect.isExtensible(target)
  - Reflect.isExtensible方法对应Object.isExtensible，返回一个布尔值，表示当前对象是否可扩展
  - 如果参数不是对象，会报错
+ Reflect.preventExtensions(target)
  - 对应Object.preventExtensions方法，用于让一个对象变为不可扩展。它返回一个布尔值，表示是否操作成功
  - 如果参数不是对象，ES5环境下报错，ES6环境下返回传入的参数
+ Reflect.ownKeys(target)
  - 用于返回对象的所有属性，基本等同于Object.getOwnPropertyNames与Object.getOwnPropertySymbols之和
  - 第一个参数不是对象，会报错
### 实例
使用Proxy实现观察者模式
观察者模式（Observer mode)指的是函数自动观察数据对象，一旦对象有变化，函数就会自动执行
```
const person = observable({
  name: '张三',
  age: 20
})

function print() {
  console.log(`${person.name}, ${person.age}`)
}

observe(print)
person.name = '李四' 
// 输出
// 李四,20
```

上面代码中，数据对象person是观察目标，函数print是观察者，一旦数据对象发生变化，print就会自动执行
下面，使用Proxy写一个观察者模式的最简单实现，即实现observable和observe这两个函数。思路是observable函数返回一个原始对象的Proxy代理，拦截赋值操作，触发充当观察者的各个函数
```
const queueObservers = new Set()

const observe = fn => queueObservers.add(fn)

const observable = obj => new Proxy(obj, {set})

function set(target, key, value, receiver) {
  const result = Reflect.set(target, key ,value, receiver);
  queueObservers.forEach(observer => observer())
  return result
}
```

上面代码中，先定义了一个Set集合，所有观察者函数都被放进去这个集合。然后，observable函数返回原始对象的代理，拦截赋值操作。拦截函数set之中，会自动执行所有观察者。