## 三列布局，两边固定，中间自适应
1. flex布局，在父元素定义display:flex,左右两个元素固定宽度，中间元素flex:1
2. 使用calc动态计算中间的值
3. 圣杯布局（自适应的放在前面，固定的放在后面）
4. 双飞翼布局（与圣杯布局的区别：自适应部分又被包了一层）
5. 利用左右浮动，脱离文档流，中间元素正常，设置左右margin
6. 利用绝对定位

## 垂直居中对齐
+ 已知宽高
  1. position和margin（固定定位到top和left50%的位置，利用margin移动自身宽高一半）
+ 未知宽高
  1. flex布局（在父元素中设置display: flex;justify-content: center; align-items: center）
  2. position和transfrom（固定定位到top和left50%的位置，利用transform: translate(-50%,-50%)移动自身的一半）
  3. inline-height和text-align
  4. 利用table-cell


## css单行溢出显示...
```css
  white-space: nowarp;
  overflow: hidden;
  text-overflow: ellipsis;
```

## css多行显示...
```css
  display: -webkit-box;
  -webkit-line-clamp: 3; //显示几行
  -webkit-box-orient: vertical
```

## 字母数字不会换行问题
`word-break: break-all`
<!--
 * @Author: your name
 * @Date: 2021-04-27 22:37:07
 * @LastEditTime: 2021-04-27 22:37:30
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /test/Users/lxt/note/css.md
-->
### BFC IFC `

### 一些网站
[matrix3d]http://ds-overdesign.com/transform/matrix3d.html
[matrix]http://meyerweb.com/eric/tools/matrix/
[css-matrix3d]https://github.com/Zhanggdroid/CSS-Matrix3d  不存在
[tools]http://www.f2e.name/case/css3/tools.html 不存在
