/*
 * @Author: your name
 * @Date: 2021-04-26 23:00:59
 * @LastEditTime: 2021-04-27 22:10:03
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /test/Users/lxt/note/继承.js
 */
// ES5
function Parent(color, price) {
  this.color = color
  this.price = price
}

Parent.prototype.show = function() {
  console.log(this.color + this.price + this.name)
}

function Child(name, color, price) {
  this.name = name
  Parent.call(this, color, price)
}

Child.prototype = Object.create(Parent.prototype)
Child.prototype.constructor = Child

var a = new Child('xiao', '红色', 14)
a.show()


// ES6
class Parent{
  constructor(color, price) {
    this.color = color
    this.price = price
  }
  show() {
    console.log(this.color + this.price + this.name)
  }
}

class Child extends Parent {
   constructor(color) {
     super(color)
   }
   test() {
     console.log(1)
   }
}
Child.prototype.test = function() {console.log(2)}
var b = new Child('ddd')
b.test()
// 1、手写bind
// 2、深拷贝
// 3、原型链