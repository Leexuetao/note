/*
 * @Author: your name
 * @Date: 2021-04-25 22:45:52
 * @LastEditTime: 2021-04-25 22:47:17
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: /test/Users/lxt/note/变量提升.js
 */

// 1、变量提示（函数提升优先变量提升）
alert(a) // function a() {alert(10)}
a() // 10
var a = 3
function a() {
  alert(10)
}
alert(a) // 3
a= 6
a() // 报错，a is not a function

// 2、 
var a = function test(num) {
  test = num;
  console.log(typeof test)
  console.log(test)
}
a(1)
// function
// function test(num) {
//   test = num;
//   console.log(typeof test)
//   console.log(test)
// }

// 3、
function test(num) {
  test = num;
  console.log(typeof test)
  console.log(test)
}
test(1)

// number
// 1