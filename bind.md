## 手写apply

```js
  Function.prototype.myApply = function(context, rest) {
    if (typeof this !== 'function') {
      new TypeError('not function')
    }
    let self = this
    let fn = Symbol()
    context[fn] = self
    let res = rest ? context[fn](...rest) : context[fn]()
    delete context[fn]
    return res
  }

```

## 手写bind

```js
  Function.prototype.myBind = function(context, ...rest1) {
    let self = this

    function F(){}
    F.prototype = this.prototype

    function bound(...rest2) {
      let args = [...rest1, ...rest2]
      return self.myApply(this instanceof F ? this : context || this, args)
    }

    bound.prototype = new F()
    return bound
  }
```