<!--
 * @Author: your name
 * @Date: 2021-04-27 23:51:34
 * @LastEditTime: 2021-04-28 00:03:09
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /test/Users/lxt/note/手写bind.md
-->
```
Function.prototype.mybind = function(obj, ...rest) {
      return (...arg) => {
        var fn = Symbol()
        obj[fn] = this
        var res = obj[fn](...rest, ...arg)
        obj[fn] = undefined
        return res
      }
    }

    //有个问题，自己实现的mybind不能new

```