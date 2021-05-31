# 概念

+ template
+ 渲染函数
+ vnode(virtual dom)
+ patch(diff算法)
+ view

+ vue.js通过编译template模板转换成渲染函（render),执行渲染函数就可以得到一个虚拟节点树
+ VNode虚拟节点：它可以代表一个真实的dom节点。通过createElement方法能将VNode渲染成dom节点。简单地说，vnode可以理解成节点描述对象，它描述了应该怎样去创建真实的DOM节点
+ patch(也叫做patching算法)：虚拟DOM最核心的部分，它可以将vnode渲染成真实的DOM,这个过程是对比新旧虚拟节点之间有哪些不同，然后根据对比结果找出需要更新的节点进行更新。











# 一、diff算法
+ Diff算法是一种通过同层的树节点进行比较的高效算法，避免对树的逐层遍历，减少时间复杂度。diff算法在很多场景下都有用，比如vue虚拟dom渲染生成真实dom的新旧VNode
+ diff算法两个特点
  - 只会同级比较，不跨层级
  - diff比较循环两边往中间收拢
# 二、Vue Diff算法
vue的虚拟dom diff核心在于patch过程

+ 首先将新旧VNode进行开始位置和结束位置的标记
+ 标记好节点位置，进行循环处理节点
+ 递归处理

# 总结
+ 每次diff都会调用updateChildren方法来比较，就这样层层递归下去，直到将旧VNode和新VNode中的所有子节点比对完。Dom Diff的过程更像是两个树的比较，每找到相同节点时，都会一层一层的往下比较它们的子节点，是一个*深度递归遍历比较*的过程



# vue2 vue3

# Diff算法
简单来说，diff算法有以下过程
+ 同级比较，再比较子节点
+ 先判断一方有子节点一方没有子节点的情况（如果新的children没有子节点，将旧的子节点移除）
+ 比较都有子节点的情况（核心diff)
+ 递归比较子节点