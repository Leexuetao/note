<!--
 * @Author: your name
 * @Date: 2021-05-30 13:34:24
 * @LastEditTime: 2021-05-30 21:11:05
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /test/Users/lxt/note/vue数据双向绑定.md
-->
# vue 双向绑定原理
+ 1、原理
  View的变化能实时让Model发生变化，而Model的变化也能实时更新到View
  Vue采用数据劫持&发布-订阅模式的方式，通过ES5提供的Object.defineProperty()方法来劫持（监控）各属性的getter、setter，并在数据（对象）发生变动时通知订阅者，触发相应的的监听回调。并且，由于是在不同的数据上触发同步，可以精确的将变更发送给绑定的视图，而不是对所有的数据都执行一次检测。要实现Vue中的双向数据绑定，大致可以划分三个模块：Observer、Compile、Watcher，如图

new MVVM() --- Observer 监听数据，通知订阅者 --> Dep <-- 添加订阅者，获取通知 --> Watcher

              Compile 订阅数据发生变化，绑定更新函数 ----> Watcher

              Compile 解析模版指令  初始化视图 --> Update <-- 调用Update()，更新视图  Wathcer

  + Observer数据监听器：负责对数据对象的所有属性进行监听（数据劫持），监听到数据发生变化后通知订阅者
  + Compile指令解析器：扫描模板，并对指令进行解析，然后绑定制定事件
  + Watcher订阅者：关联Observer和Compile,能够订阅并收到属性变动的通知，执行指令绑定的相应操作，更新视图。Update是一个它自身的一个方法，用于执行Compile中绑定的回调，更新视图。

模板渲染解析时watcher会对应绑定指令（一对一）
此时会通过调用订阅者watcher初始化（watcher中的get()方法）去触发对应属性在发布者observer里（object.defineProperty）的getter，observer会判断是不是通过watcher初始化调用的（Dep.target,实例化之后会清空），只有是才能通过dep类 依赖收集

observer通过depend通知Dep类收集（addDep方法，在watcher类中，会传入当前Dep实例调用自身）当前该订阅者（watcher)中当触发更新的方法,同时第一次初始化watcher.update()初始化视图。此后每次的数据更新都会通过observer中的setter去触发dep类中的回调update执行收集依赖的所有方法更新订阅者中的状态同时更新视图。

observer在处理对象和数据的时候，如果是数组，并且调用的方法会改变数组的长度，则会重新增加索引之后更新数组，进行重新监听。（因为调用数组原生API可能多次触发getter setter且索引不会变），如果是对象则通过对象的getter获取值和setter更新值


### vue2和vue3版本比较
vue是基于依赖收集的双向绑定
3.0之前的版本使用的Object.defineProperty,3.0新版本使用Proxy
+ 基于 数据劫持/依赖收集 的双向绑定的优点
  + 不需要显示的调用，Vue利用数据劫持+发布订阅，可以直接通知变化并且驱动视图
  + 直接得到精确的变化数据，劫持来属性setter，当属性值改变我们可以精确的获取变化的内容newVal，不需要额外的diff操作
+ Object.defineProperty的缺点
  + 不能监听数组；因为数组没有getter和setter，因为数组长度不确定，如果太长性能负担太大
  + 只能监听属性，而不是整个对象；需要遍历属性
  + 只能监听属性变化，不能监听属性的删减
+ proxy好处
  + 可以监听数组
  + 监听整个对象不是属性
  + 13中拦截方法，强大很多
  + 返回新对象而不是直接修改源对象，更符合immutable
+ proxy缺点
  + 兼容性不好，且无法用哪个polyfill磨平


# 前端框架设计模式（MVVM）的含义


+ Model
  + 在MVVM中，我们可以把Model称为数据层，因为它仅仅关注数据本身，不关心任何行为（格式化数据由View 的负责）

+ View
  + MVVM中的View通过使用模版语法来声明式将数据渲染成DOM,当ViewModel对Model进行更新对时候，会通过数据绑定更新到View

+ ViewModel
  + ViewModel是整个模式的重点，业务逻辑也主要集中在这里，其中的一大核心就是数据绑定
  + 当Model发生变化，ViewModel就会自动更新；ViewModel变化，Model也会更新
  + 在MVVM中，View不知道Model的存在，ViewModel和Model也察觉不到View，这种低耦合模式可以使开发过程更加容易，提高应用的可重用性

总结
+ MV*的目的就是把应用程序的数据、业务逻辑和界面这三块解耦，分离关注点，不仅利于团队协作和测试，更有利于维护和管理。业务逻辑不再关心底层数据的读写，而这些数据又以对象的形式呈现给业务逻辑层。
