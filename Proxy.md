### Proxy
#### 概述
+ Proxy用于修改某些操作的默认行为，等同于在语言层做出修改
+ Proxy可以理解成，在目标对象之前架设一层“拦截”，外界对该对象的访问，都必须先通过这层拦截，因此提供了一种机制，可以对外界的访问进行过滤和改写。
+ ES6原生提供Proxy构造函数，用来生成Proxy实例

#### 支持Proxy拦截操作的
1. get(target, propKey, receiver)：拦截对象属性的读取
2. set(target, propKey,value, receiver):拦截对象属性的设置
3. apply()方法拦截函数的调用，call和apply操作
4. has(target, propKey): 拦截propKey in proxy的操作，返回一个布尔值
5. construct(target, args, newTarget): 拦截Proxy实例作为构造函数调用的操作
6. deleteProperty()方法用于拦截delete操作
7. defineProperty()方法用于拦截Object.defineProperty()操作
8. getOwnPropertyDescriptor()方法拦截Object.getOwnPropertyDescriptor()
9. getPrototypeOf()方法主要用来拦截获取对象原型
10. isExtensible()方法拦截Object.isExtensible()操作
11. ownKeys()用来拦截对象自身属性的读取操作
12. preventExtensions()方法拦截Object.preventExtensions()操作
13. setPrototypeof()方法拦截Object.setPrototypeOf()

### Proxy实例的方法
+ get()方法用于拦截某个属性的读取操作，可以接受三个参数，依次为目标对象，属性名和proxy实例本身，其中最后一个参数可选
  + 可以用于函数名的链式使用
  + 可以用于生成各种DOM节点的通用函数
  + 第三个参数，它总是指向原始的读操作所在的那个对象(todo不知道有什么用)
  + 如果一个属性不可以配置（configurable)且不可写（writable)，则Proxy不能修改该属性，否则通过Proxy对象访问该属性会报错
+ set()方法用于拦截某个属性的赋值操作，可以接受四个参数，依次为目标对象，属性名，属性值和Proxy实例本身，其中最后一个参数可选
  + 可以进行数据验证validator
  + 可以数据绑定，每当对象发生变化时，会自动更新DOM
  + 可以防止内部属性被外部读写，例如：内部属性为_开头的字符，表示这些属性不应该被外部使用
  + 第四个参数receiver，指的是原始的操作行为所致的那个对象（todo不知道有什么用）
  + 如果一个属性不可写，那么set方法将不起作用
  + 注意：set代理应当返回一个布尔值，严格模式下，set代理如果没有返回true，就会报错
+ apply()方法拦截函数的调用，call和apply操作，可以接受三个参数，依次为目标对象，目标对象的上下文对象（this)和目标对象的参数数组
  + 每当执行proxy函数（直接调用或call和apply调用），就会被apply方法拦截
  + 直接调用Reflect.apply方法，也会被拦截
+ has()方法用于拦截HasProperty操作，即判断对象是否具有某个属性时，这个方法会生效。典型的操作就是in运算符，可以接受两个参数，分别是目标对象、需查询的属性名
  + 如果原对象不可配置或者禁止扩展，这时has()拦截会报错 （禁止扩展---> Object.preventExtensions(obj)
  + 注意： has()方法拦截的是HasProperty操作，而不是HasOwnProperty操作，即has()方法不判断一个属性是对象自身的属性，还是继承的属性
  + 虽然for...in循环也用到in运算符，但是has()拦截对for...in循环不生效
+ construct()方法用于拦截new命令，可以接受三个参数，依次是目标对象，构造函数的参数数组，创建实例对象是new命令作用的构造函数
  + construct()方法返回必须是一个对象，否则会报错
  + construct()方法拦截的是构造函数，所以它的目标对象必须是函数，否则会报错
  + 注意：construct()方法中的this指向的是handler，而不是实例对象
+ deleteProperty()方法用于拦截delete操作，如果这个方法抛出错误或者返回false，当前属性就无法被delete命令删除
  + 注意，目标对象自身的不可配置（configurable)的属性，不能被deleteProperty方法删除，否则报错
+ defineProperty()方法拦截了Object.defineProperty()操作
  + 注意：如果目标对象不可扩展（non-extensible)，则defineProperty()不能增加目标对象上不存在的属性，否则会报错
    + Object.preventExtensions(obj) ---> 让一个对象变的不可扩展，也就是永远不能再添加新的属性
  + 如果目标对象的某个属性不可写（writable)或不可配置（configurable），则defineProperty()方法不得改变这两个设置
+ getOwnPropertyDescriptor()方法拦截Object.getOwnPropertyDescriptor()，返回一个属性描述对象或者undefined
+ getPrototypeOf()方法主要用来拦截获取对象原型
  + 拦截以下操作
    - Object.prototype.__ proto__
    - Object.prototype.isPrototypeOf()
    - Object.getprototpeOf()
    - Reflect.getPrototypeOf()
    - instanceof
  + 注意：getPrototype()方法的返回值必须是对象或者null,否则报错，
  + 如果目标对象不可扩展（non-extensible),getPrototypeOf()方法必须返回目标对象的原型对象
+ isExtensible()方法拦截Object.isExtensible()操作
  + 注意：该方法只能返回布尔值，否则返回值会被自动转为布尔值。
  + 这个方法有一个强限制，返回值必须与目标对象的isExtensible属性保持一致，否则就会报错
+ ownKeys()用来拦截对象自身属性的读取操作
  + 拦截以下操作
    - Object.getOwnPropertyNames()
    - Object.getOwnPropertySymbols()
    - Object.keys()
    - for...in循环
  + 注意：使用Object.keys()方法是，有三类属性会被ownKeys()方法自动过滤，不会返回
    - 目标对象上不存在的属性
    - 属性名为Symbol值
    - 不可遍历（enumberable)的属性
  + 还可以拦截Object.getOwnPropertyNames()，会过滤属性名为Symbol的值，不会返回
  + 还可以拦截for...in循环（过滤同Object.keys())
  + 注意：ownKeys()方法返回的数组成员，只能是字符串或者Symbol值，如果有其他类型的值，或者返回的根本不是数组，就会报错
  + 注意：如果目标对象包含不可配置的属性，则改属性必须被ownKeys()方法返回，否则报错
  + 注意：如果目标对象是不可扩展的（non-extensible）,这是ownKeys()方法返回的数组之中，必须包含原对象的所有属性，且不能包含多余的属性，否则报错
+ preventExtensions()方法拦截Object.preventExtensions()。该方法必须返回一个布尔值，否则会被自动转为布尔值
  + 有一个限制，只有目标对象不可以扩展时（即Object.isExtensible(proxy)为false），proxy.preventExtensions才能返回true,否则报错
+ setPrototype()方法主要用来拦截Object.setPrototypeOf()方法
  + 该方法只能返回布尔值，否则会被自动转为布尔值。另外，如果目标对象不可扩展（non-extensible)，setPrototypeOf()方法不得改变目标对象的原型

### Proxy.revocable()
Proxy.revocable方法返回一个可取消的Proxy实例
```js
  let target = {};
  let handler = {};

  let {proxy, revoke} = Proxy.revocable(target, handler);

  proxy.foo = 123;
  proxy.foo // 123

  revoke();
  proxy.foo // TypeError: Revoked
```
+ Proxy.revocable()方法返回一个对象，该对象的proxy属性是Proxy实例，revoke属性是一个函数，可以取消Proxy实例
+ 上面代码中，当执行revoke函数之后，再访问Proxy实例，就会抛出一个错误

+ 使用场景，目标对象不允许直接访问，必须通过代理访问，一旦访问结束，就收回代理权，不允许再次访问

### this问题
+ Proxy代理的目标对象内部的this关键字会指向Proxy代理
+ 有些原生对象的内部属性，只有通过正确的this才能拿到，所以Proxy无法代理这些原生对象的属性，这是，可以通过this绑定原始对象

### 实例：Web服务的客服端
+ Proxy对象可以拦截目标对象的任意属性，这使得它很合适用来写Web服务的客户端

```js
const service = createWebService('http://example.com/data');

service.employees().then(json => {
  const employees = JSON.parse(json);
  // ···
});
```
上面代码新建了一个 Web 服务的接口，这个接口返回各种数据。Proxy 可以拦截这个对象的任意属性，所以不用为每一种数据写一个适配方法，只要写一个 Proxy 拦截就可以了。
```js
function createWebService(baseUrl) {
  return new Proxy({}, {
    get(target, propKey, receiver) {
      return () => httpGet(baseUrl + '/' + propKey);
    }
  });
}
```
同理，Proxy也可以用来实现数据库的ORM层