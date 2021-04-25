/*
 * @Author: your name
 * @Date: 2021-04-25 22:45:52
 * @LastEditTime: 2021-04-25 23:02:57
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /test/Users/lxt/note/变量提升.js
 */

// 1、变量提示（函数提升优先变量提升）
// 当函数名和变量名相同，变量没有被赋值，则函数生效，否则变量生效
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
test(1) // 报错，test is not defined  // test在外部访问不了



// 3、
function test(num) {
  test = num;
  console.log(typeof test)
  console.log(test)
}
test(1)

// number
// 1


// 4
var s = function g(){}
// g是只读的，g只能在函数的内部访问  g相当于一个表达式，函数体？？？

  