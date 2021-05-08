# Vue2和Vue3的区别

## Vue3的设计目标
+ 更小
+ 更快
+ 加强TypeScript支持
+ 加强API设计一致性
+ 提高自身可维护性
+ 开放更多底层功能


## 1、创建一个应用实例
Vue2: Vue是一个function，需要new一个实例
```
  const vm = new Vue({
    el: '#app',
    data: {
      msg: 123
    }
  })
```
Vue3:Vue是一个object,需要createApp创建一个实例
```
  const app = Vue.createApp({
    data() {
      return {
        msg: 123
      }
    }
  })
```

## 2、Vue2的optionsAPI --> Vue3的CompositionAPI
Vue2中的optionsAPI(选项API)
  + 在代码里分割了不同的属性： data, computed, watch, methods

Vue3新增加compositionAPI（组合式API)
  + 目的是将同一个逻辑关注点相关的代码配置在一起，每一个逻辑关注点放在一个独立的组合式函数中，最后引入他们使用
  + setup组件选项
    + 在执行setup时，组件实例尚未被创建，因此在setup选项中没有this
    + setup选项是一个接受props和context的函数
      - 第一个参数props
        ```
          export default {
            props: {
              title: String
            },
            setup(props) {
              console.log(props.title)
            }
          }
        ```
        - props 是响应式的，当传入新的 prop 时，它将被更新
        - 因为 props 是响应式的，你不能使用 ES6 解构，因为它会消除 prop 的响应性。如果需要解构 prop，可以通过使用 setup 函数中的 toRefs 来完成此操作
          ```
            import { toRefs } from 'vue'

            setup(props) {
              const { title } = toRefs(props)

              console.log(title.value)
            }
          ```
      - 第二个参数context
        ```
          export default {
            setup(props, context) {
              // Attribute (非响应式对象)
              console.log(context.attrs)

              // 插槽 (非响应式对象)
              console.log(context.slots)

              // 触发事件 (方法)
              console.log(context.emit)
            }
          }
        ```
### 2.1建立数据data
  Vue2会把数据放在data属性中
  ```
  export default {
    props: {
      title: String
    },
    data () {
      return {
        username: '',
        password: ''
      }
    }
  }

  ```
  在Vue3中，我们就需要使用一个新的setup()方法，此方法在组件初始化构造的时候触发。

  为了可以让开发者对反应型数据有更多的控制，我们可以直接使用到 Vue3 的反应API（reactivity API）。

  使用以下三步来建立反应性数据:

  + 从vue引入reactive
  + 使用reactive()方法来声名我们的数据为反应性数据
  + 使用setup()方法来返回我们的反应性数据，从而我们的template可以获取这些反应性数据
  这里构造的反应性数据就可以被template使用，可以通过state.username和state.password获得数据的值。
  ```
  import { reactive } from 'vue'

  export default {
    props: {
      title: String
    },
    setup () {
      const state = reactive({
        username: '',
        password: ''
      })

      return { state }
    }
  }
  ```

  在Vue3的唯一真正的不同在于数据获取。Vue3中的反应数据（Reactive Data）是包含在一个反应状态（Reactive State）变量中。— 所以我们需要访问这个反应状态来获取数据值。
### 2.2Vue2 对比 Vue3的 methods 编写
Vue2 的选项型API是把methods分割到独立的属性区域的。我们可以直接在这个属性里面添加方法来处理各种前端逻辑。
```
export default {
  props: {
    title: String
  },
  data () {
    return {
      username: '',
      password: ''
    }
  },
  methods: {
    login () {
      // 登陆方法
    }
  }
}

```
Vue3 的合成型API里面的setup()方法也是可以用来操控methods的。创建声名方法其实和声名数据状态是一样的。— 我们需要先声名一个方法然后在setup()方法中返回(return)， 这样我们的组件内就可以调用这个方法了。

```
export default {
  props: {
    title: String
  },
  setup () {
    const state = reactive({
      username: '',
      password: ''
    })

    const login = () => {
      // 登陆方法
    }
    return { 
      login,
      state
    }
  }
}
```

### 2.3生命周期钩子注册在setup内部
  为了使组合式API的功能比选项式API更加完整，我们还需要一种在setup中注册生命周期钩子的方法
  组合式 API 上的生命周期钩子与选项式 API 的名称相同，但前缀为 on：即 mounted 会看起来像 onMounted。
  | 选项式API |  Hook inside (setup)
  | -- | -- 
  | beforeCreate |	Not needed*
  |created	| Not needed*
  |beforeMount	| onBeforeMount
  |mounted	| onMounted
  |beforeUpdate	| onBeforeUpdate
  |updated	| onUpdated
  |beforeUnmount	| onBeforeUnmount
  |unmounted	| onUnmounted
  |errorCaptured	| onErrorCaptured
  |renderTracked	| onRenderTracked
  |renderTriggered	| onRenderTriggered

  + 因为 setup 是围绕 beforeCreate 和 created 生命周期钩子运行的，所以不需要显式地定义它们。换句话说，在这些钩子中编写的任何代码都应该直接在 setup 函数中编写

### 2.4 响应式API
  + 带ref的响应式变量
    换句话说，ref 为我们的值创建了一个响应式引用。在整个组合式 API 中会经常使用引用的概念。
    ref 接受一个内部值并返回一个响应式且可变的 ref 对象。ref 对象具有指向内部值的单个 property .value
    ```
      import { ref } from 'vue'

      const counter = ref(0)

      console.log(counter) // { value: 0 }
      console.log(counter.value) // 0

      counter.value++
      console.log(counter.value) // 1
    ```
  + reactive
    reactive 返回对象的相应式副本
    ```
      const obj = reactive({ count: 0 })
    ```
    + 响应式转换是“深层”的——它影响所有嵌套 property。在基于 ES2015 Proxy 的实现中，返回的 proxy 是不等于原始对象的。建议只使用响应式 proxy，避免依赖原始对象。

  ```
    const count = ref(1)
    const obj = reactive({ count })

    // ref 会被解构
    console.log(obj.count === count.value) // true

    // 它会更新 `obj.value`
    count.value++
    console.log(count.value) // 2
    console.log(obj.count) // 2

    // 它也会更新 `count` ref
    obj.count++
    console.log(obj.count) // 3
    console.log(count.value) // 3

  ```
  reactive 将解构所有深层的 refs，同时维持 ref 的响应性。 


### 2.5watch响应式更改
  就像我们在组件中使用 watch 选项并在 user property 上设置侦听器一样，我们也可以使用从 Vue 导入的 watch 函数执行相同的操作。它接受 3 个参数：
  + 一个我们想要侦听的响应式引用或 getter 函数
  + 一个回调
  + 可选的配置选项
  ```
    import { ref, watch } from 'vue'

    const counter = ref(0)
    watch(counter, (newValue, oldValue) => {
      console.log('The new counter value is: ' + counter.value)
    })
  ```
  等效于Vue2中
  ```
  export default {
    data() {
      return {
        counter: 0
      }
    },
    watch: {
      counter(newValue, oldValue) {
        console.log('The new counter value is: ' + this.counter)
      }
    }
  }
  ```
### 2.6计算属性-computed
Vue2中，只需要在组件内的选项属性中添加属性即可
```
export default {
  // .. 
  computed: {
    lowerCaseUsername () {
      return this.username.toLowerCase()
    }
  }
}
```

Vue3中
  + Vue3 的设计模式给予开发者们按需引入需要使用的依赖包。这样一来就不需要多余的引用导致性能或者打包后太大的问题。Vue2就是有这个一直存在的问题
  + 独立的computed属性
    与 ref 和 watch 类似，也可以使用从 Vue 导入的 computed 函数在 Vue 组件外部创建计算属性
    ```
      import { ref, computed } from 'vue'

      const counter = ref(0)
      const twiceTheCounter = computed(() => counter.value * 2)

      counter.value++
      console.log(counter.value) // 1
      console.log(twiceTheCounter.value) // 2
    ```
    在这里，我们为 computed 函数传递了它的第一个参数，它是一个 getter 类回调函数，输出的是一个只读的响应式引用。为了访问新创建的计算变量的 value，我们需要像使用 ref 一样使用 .value property。
  
### 2.7 使用Provide/Inject
  + 使用Provide
    + 首先从 vue 显式导入 provide 方法
    + 调用 provide 时来定义每个 property（允许有两个参数定义property）
      + property 的 name (<String> 类型)
      + property 的 value
      ```
        import { provide } from 'vue'

        setup() {
          provide('location', 'North Pole')
          provide('geolocation', {
            longitude: 90,
            latitude: 135
          })
        }
      ```
  + 使用inject
    + 首先从 vue 显式导入 inject 方法
    + 调用它来定义如何将它暴露给我们的组件（inject有两个参数）
      + 要 inject 的 property 的名称
      + 一个默认的值 (可选)
      ```
        import { inject } from 'vue'
        setup() {
          const userLocation = inject('location', 'The Universe')
          const userGeolocation = inject('geolocation')

          return {
            userLocation,
            userGeolocation
          }
        }
      ```
  + 响应性
    + 为了增加 provide 值和 inject 值之间的响应性，我们可以在 provide 值时使用 ref 或 reactive
    ```
    import { provide, reactive, ref } from 'vue'
    setup() {
      const location = ref('North Pole')
      const geolocation = reactive({
        longitude: 90,
        latitude: 135
      })

      provide('location', location)
      provide('geolocation', geolocation)
    }
    ```
    + 修改响应式property
    + 当使用响应式 provide / inject 值时，建议尽可能，在提供者内保持响应式 property 的任何更改
    + 如果想在注入数据的组件内部更新inject数据时，建议 provide 一个方法来负责改变响应式 property。
    ``` provide
      setup() {
        const updateLocation = () => {
          location.value = 'South Pole'
        }
        provide('updateLocation', updateLocation)
      }
    ```
    ```inject
      setup() {
        const updateUserLocation = inject('updateLocation')

        return {
          updateUserLocation
        }
      }
    ```
    + 如果要确保通过 provide 传递的数据不会被 inject 的组件更改，我们建议对提供者的 property 使用 readonly。
    ```
    import { provide, reactive, readonly, ref } from 'vue'

    provide('location', readonly(location))
    provide('geolocation', readonly(geolocation))
    ```
  Vue3的compositionApi适用于高级
  CompositionAPI新添加的api，可以与现有options API一起使用






## 3、teleport
+ 允许我们控制在 DOM 中哪个父节点下渲染了 HTML
+ 场景：像 modals,toast 等这样的元素，很多情况下，我们将它完全的和我们的 Vue 应用的 DOM 完全剥离，管理起来反而会方便容易很多

我们使用 teleport 组件，通过 to 属性，指定该组件渲染的位置,to="body"相当于渲染位置在body下
```
  <teleport to="body">
    <div v-if="modalOpen" class="modal">
      <div>
        I'm a teleported modal! 
        (My parent is "body")
        <button @click="modalOpen = false">
          Close
        </button>
      </div>
    </div>
  </teleport>
```

对标react portal

## 4、Fragment 片段
Vue 3 现在正式支持了多根节点的组件，也就是片段！

Vue2:在 2.x 中，由于不支持多根节点组件，当开发者意外创建一个时会发出警告。为了修复这个问题，许多组件被包裹在一个 \< div \> 中。
```
<template>
  <div>
    <header>...</header>
    <main>...</main>
    <footer>...</footer>
  </div>
</template>
```

Vue3:在 3.x 中，组件可以包含多个根节点！但是，这要求开发者显式定义 attribute 应该分布在哪里。
```
<template>
  <header>...</header>
  <main v-bind="$attrs">...</main>
  <footer>...</footer>
</template>
```

```
<custom-layout id="custom-layout" @click="changeValue"></custom-layout>
app.component('custom-layout', {
  template: `
    <header>...</header>
    <main v-bind="$attrs">...</main> //属性传递到<main>元素
    <footer>...</footer>
  `
})

```
优点（减少很多组件之间的div包裹元素）





## 5、自定义事件
事件名

  Vue2中不可以使用驼峰命名子组件触发的事件，因为事件名不存在任何自动化的大小写转换，但是DOM模板中会自动转换为全小写（因为 HTML 是大小写不敏感的），导致不能被监听到

  Vue3中事件名提供了自动的大小写转换，所以可以用驼峰命名子组件触发的事件

## 6、v-model
Vue2中组件上
+ 使用v-model其实相当于传递了value属性，并触发了input事件
  ```
    <ChildComponent v-model="pageTitle" />

    <!-- 是以下的简写: -->

    <ChildComponent :value="pageTitle" @input="pageTitle = $event" />

  ```
+ 如果要将属性或事件名称更改为其他名称，则需要在ChildComponent组件中添加model选项
  ```
  // ChildComponent.vue

  export default {
    model: {
      prop: 'title',
      event: 'change'
    },
    props: {
      // 这将允许 `value` 属性用于其他用途
      value: String,
      // 使用 `title` 代替 `value` 作为 model 的 prop
      title: {
        type: String,
        default: 'Default title'
      }
    }
  }
  <!-- 是以下的简写: -->

  <ChildComponent :title="pageTitle" @change="pageTitle = $event" />

  ```
+ 使用v-bind.sync(建议使用 update:myPropName 抛出事件)

  ```
  this.$emit('update:title', newValue)

  <ChildComponent :title="pageTitle" @update:title="pageTitle = $event" />
  <!-- 简写: -->
  <ChildComponent :title.sync="pageTitle" />
  ```

Vue3中组件上
+ 使用v-model其实相当于传递一个modelValue属性，同时触发一个update:modelValue事件

```
  <my-component v-model="firstName"></my-component>

  <!-- 相当于 -->
  <my-component :modelValue="firstName" @update:modelValue="firstName"></my-component>
```
+ 若需要更改 model 名称，而不是更改组件内的 model 选项，那么现在我们可以将一个 argument 传递给 model

```
<ChildComponent v-model:title="pageTitle" />

<!-- 是以下的简写: -->

<ChildComponent :title="pageTitle" @update:title="pageTitle = $event" />
```

+ 同一个组件可以同时使用多个v-model
```
  <user-name
    v-model:first-name="firstName"
    v-model:last-name="lastName"
  ></user-name>

  <!-- 相当于 -->

  <user-name
    :first-name="firstName"
    @update:firstName = "firstName"
    :last-name="lastName"
    @update:lastName = "lastName"
  ></user-name>
```
+ 可以自定义修饰符

总结：
+ 非兼容： 用户自定义组件时，v-model prop和事件名称已更改
  + prop: value --> modelValue
  + event: input --> update:modelValue
+ 非兼容：v-bind 的 .sync 修饰符和组件的 model 选项已移除，可用 v-model 作为代替
+ 新增：现在可以在同一个组件上使用多个v-model进行双向绑定
+ 新增：现在可以自定义v-model修饰符 


## 其他改变
### v-if与v-for的优先级
Vue2中 在一个元素上同时使用 v-if 和 v-for 时，v-for 会优先作用
Vue3中 V-if 总是优先于 v-for 生效

### key的用法
#### 条件渲染

```
<template v-if="loginType === 'username'">
  <label>Username</label>
  <input placeholder="Enter your username">
</template>
<template v-else>
  <label>Email</label>
  <input placeholder="Enter your email address">
</template>
```

Vue2中
+ 那么在上面的代码中切换 loginType 将不会清除用户已经输入的内容。因为两个模板使用了相同的元素，< input > 不会被替换掉——仅仅是替换了它的 placeholder。
Vue 为你提供了一种方式来表达“这两个元素是完全独立的，不要复用它们”。
只需添加一个具有唯一值的 key attribute

Vue3中
+ 对于 v-if/v-else/v-else-if 的各分支项 key 将不再是必须的，因为现在 Vue 会自动生成唯一的 key。

#### 结合\< template v-for \>

Vue2中 < template> 标签不能拥有 key。不过你可以为其每个子节点分别设置 key
Vue3中 key 则应该被设置在 < template> 标签上

### v-bind="object" 现在排序敏感

Vue2 
+ 如果一个元素同时定义了 v-bind="object" 和一个相同的单独的 property，那么这个单独的 property 总是会覆盖 object 中的绑定。
```
<!-- template -->
<div id="red" v-bind="{ id: 'blue' }"></div>
<!-- result -->
<div id="red"></div>
```
Vue3
+ 如果一个元素同时定义了 v-bind="object" 和一个相同的单独的 property，那么声明绑定的顺序决定了它们如何合并。换句话说，相对于假设开发者总是希望单独的 property 覆盖 object 中定义的内容，现在开发者对自己所希望的合并行为有了更好的控制。

```
<!-- template -->
<div id="red" v-bind="{ id: 'blue' }"></div>
<!-- result -->
<div id="blue"></div>

<!-- template -->
<div v-bind="{ id: 'blue' }" id="red"></div>
<!-- result -->
<div id="red"></div>
```


### 自定义指令
Vue2和Vue3的钩子函数不同
Vue2的有bind,inserted, update, componentUpdate,unbind
Vue3的有created, beforeMount,mounted, beforeUpdate, updated, beforeUmount,umounted

### Provide/Inject
provide 和 inject 绑定并不是可响应的。这是刻意为之的。然而，如果你传入了一个可监听的对象，那么其对象的 property 还是可响应的
  + Vue3中可以处理响应式
    + 我们需要为 provide 的 todoLength 分配一个组合式 API computed property
    ```
      app.component('todo-list', {
        // ...
        provide() {
          return {
            todoLength: Vue.computed(() => this.todos.length)
          }
        }
      })

      app.component('todo-list-statistics', {
        inject: ['todoLength'],
        created() {
          console.log(`Injected property: ${this.todoLength.value}`) // > Injected property: 5
        }
      })
    ```

## Vue2和Vue3响应式对比
### Vue2使用的是defineProperty，有两个难解决的问题
  + 只能做第一层属性的响应，再往深处就无法实现了
  + 数组问题：defineProperty无法检测数组长度的变化，准确的是说，是无法检测通过改变length的方法而增加的长度无法检测到
  ```
  // length的属性被初始化成为了
  enumberable: false
  configurable: false
  writable: true
  // 所以说直接去删除或者修改length属性是不行的
  var a = [1,2,3]
  Object.defineProperty(a,'length',{
    enumberable: true,
  configurable: true,
  writable: true ,
  })

  // Uncaught TypeError: Cannot redefine property: length
  ```
### Vue3使用的是Proxy和Reflect，直接代理整个对象
```
function reactive(data) {
    if (typeof data !== 'object' || data === null) {
        return data
    }
    const observed = new Proxy(data, {
        get(target, key, receiver) {
            // Reflect有返回值不报错
            let result = Reflect.get(target, key, receiver)

            // 多层代理
            return typeof result !== 'object' ? result : reactive(result) 
        },
        set(target, key, value, receiver) {
            effective()
            // proxy + reflect
            const ret = Reflect.set(target, key, value, receiver)
            return ret
        },

        deleteProperty(target,key){
            const ret = Reflect.deleteProperty(target,key)
            return ret
        }

    })
    return observed
}
```
总结：
1. Object.defineProperty只能劫持对象的属性，而Proxy是直接代理对象，由于Object.definedProperty只能对属性进行劫持，需要遍历对象的每个属性。而Proxy可以直接代理对象
2. Object.defineProperty对新增属性需要手动进行Observe,由于Object.defineProperty劫持的是对象的属性，所以新增属性时，需要重新遍历对象，对其新增属性再使用Object.defineProperty进行劫持。也正式因为这个原因，使用Vue给data中数组或对象新增属性时，需要使用vm.$set才能保证新增的属性也是响应式的
3. Proxy支持13中拦截操作，这是defineProperty所不具有的新标准性能红利
4. Proxy作为新标准，长远来看，JS引擎会继续优化Proxy，但getter和setter基本不会再有针对性能优化
5. Proxy兼容性差 目前并没有一个完整支持Proxy所有拦截方法的Polyfill方案


## 总结
1. CompositionAPI:Vue3新增组合式API
  + 可以与现有的options API一起使用
  + 灵活的逻辑组合与复用

2. Teleport 传送门 
  + 允许我们控制在 DOM 中哪个父节点下渲染了 HTML

3. Fragment 片段
  + 不再限于模板中的单个根节点

4. Tree shaking support 
 + 可以将无用模块“剪辑”，仅打包需要的（比如v-model,< transition >，用不到就不会打包）

5. Performance
 + 性能更比 Vue 2.0 强。

7. Vue3更好的TypeScript支持
  + Vue3是用ts编写的库，可以享受到自动的类型定义提示
  + tsx支持
  + class组件的支持

8. performance优化
  + 重构了虚拟DOM,保持兼容性，使dom脱离模板渲染，提升性能
  + 优化了模板编译过程，增加patchFlag，遍历节点的时候，会跳过静态节点
  + 高效的组件初始化
  + 组件upload的过程性能提升1.3~2倍
  + SSR速度提升2~3倍

9. Proxy：不只是解决了 defineProperty 的局限性。


Custom Renderer API：暴露了自定义渲染 API。


## 生态群 UI库
Vue2版本的Element-UI 升级到 Vue3版本的Element-plus
其他支持Vue3的组件库
+ Ant Design of Vue (Antd 官方推荐的组件库)
+ vant
+ NutUI 3 (京东团队开发的移动端组件库)
