/*
 * @Author: your name
 * @Date: 2021-04-25 23:03:07
 * @LastEditTime: 2021-04-26 00:03:56
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /test/Users/lxt/note/this.js
 */

// 1\
this.a = 20
var test = {
  a: 40,
  init: () => {
    console.log(this.a)
    function go() {
      console.log(this.a)
    }
    go.prototype.a = 50
    return go
  }
}

new (test.init())() // 20 箭头函数指向的window
// new(go)() // new一个函数 go 指向实例，实例没有，找原型链， 50

// 2\
this.a = 20
var test = {
  a: 40,
  init: () => {
    console.log(this.a)
    function go() {
      this.a = 60
      console.log(this.a)
    }
    go.prototype.a = 50
    return go
  }
}

var p = test.init()
p
new (test.init())()

//3
this.test = 1

var s = {
  test: 1,
  a: function() {
    console.log(1+this.test)
  },
  b() {
    console.log(2)
  }
}

var f = s.a.bind(this)
new f() // NaN  1+undefined = NaN
var p = s.b.bind(this)
new p() // 报错TypeError: p is not a constructor 简写形式当函数不可以被new,箭头函数也不可以被new