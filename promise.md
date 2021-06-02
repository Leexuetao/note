<!--
 * @Author: your name
 * @Date: 2021-06-01 21:16:13
 * @LastEditTime: 2021-06-02 22:06:32
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: /test/Users/lxt/note/promise.md
-->
## promise基本特性

1. Promise有三种状态：pending(进行中)、fullfilled(已成功)、rejected(已失败)
2. Promise对象接收一个回调函数作为参数，该回调函数接收两个参数，分别是成功时的回调resolve和失败时的回调reject;另外resolve的参数除了正常值以外，还可能是一个Promise对象的实例；reject的参数通过是一个Error对象的实例
3. then方法返回一个新的Promise实例，并接收两个参数onResolved(fullfilled状态的回调)；onRejected(rejected状态的回调，该参数可选)
4. catch方法返回一个新的Promise实例
5. finally方法不管Promise状态如何都会执行，该方法的回调函数不接收任何参数
6. Promise.all方法将多个Promise实例，包装成一个新的Promise实例，该方法接收一个由Promise对象组成的数组作为参数（promise.all()方法的参数可以不是数组，但必须具有Interator接口，且返回的每个成员都是Promise实例），注意参数中只要有一个实例触发catch方法，都会触发Promise.all()方法返回的新的实例的catch方法，如果参数中的某个实例本身调用了catch方法，将不会触发promise.all方法返回的新实例的catch方法