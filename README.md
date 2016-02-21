# Java 库不能多次重复加载, 会导致进程崩溃

> 每个进程只有一个 java 实例, 在初始化之前保证路径已经加入到 java.classpath 中
> factory 本身并不加载 java 库, 每个应用在初始化时首先初始化一个 java 并
> 传递给 factory, 深度嵌套的库本身使用 factory 来初始化自身


## install

```bash
npm install java-factory-lib
```

> 如果 java 库没有安装, 则自动安装 java 库


## usage

```js
// java 已经被安装的情况下
var jfact = require('java-factory-lib');

// jar 路径, 亦可以通过这个方法引入 class 类目录
jfact.loadjar('../somedir/');

// 初始化路径
jfact.setJavaInstance(require('java'));

// 所有实用 java 库的部分都用这个方法获取实例
var java = jfact.getJavaInstance();

// 编译 src 目录中的 java 文件, 输出到 bin 目录
// 有错误会中断运行, 错误信息设置在 err 中
// 被编译的文件必须是 UTF8 编码
jfact.compile(src, bin, function(err, msg) {});

// 获取 classpath 字符串, 依赖之前通过 loadjar 加入的路径
// 当不含有路径时, 返回 null
jfact.getClassPath();
```