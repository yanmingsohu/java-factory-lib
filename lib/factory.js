
var fs        = require('fs');
var path      = require('path');
var java      = null;
var classpath = [];


var jfact = module.exports = {
  init            : init,
  loadjar         : loadjar,
  getJavaInstance : getJavaInstance,
  setJavaInstance : setJavaInstance,
  getClassPath    : getClassPath,
};


//
// 在项目安装了 java 库之后, 才能调用该方法
// 该方法允许多次调用
//
function init() {
  if (!java) {
    setJavaInstance( require('java') );
  }
  return jfact;
}


//
// 同步方法
//
function getJavaInstance() {
  if (!java) {
    throw new Error('Java cannot init');
  }
  return java;
}


//
// 使用一个给定的 java 初始化库
//
function setJavaInstance(_java) {
  if (java) {
    if (java === _java) {
      return;
    }

    //
    // 抛异常是为了便于调试; 两次设置不同的 java 实例
    // 可能是多层包引用引起的, 或在不同的地方创建, 应
    // 仔细查找原因
    // 
    throw new Error('cannot init again');
  }

  java = _java;

  classpath.forEach(function(dir) {
    java.classpath.push(dir);
  });

  var mod = module.parent.parent;
  var msg = (mod && mod.filename) || '[unknow module]';

  console.log('[', new Date(), '] Java factory init', msg);
}


//
// 可以在初始化之前调用
// 加载一个目录中的 jar 到 classpath, 不会遍历子路径
// 同步方法
// 这个目录本身也会加入到 classpath 中
//
function loadjar(jardir) {
  try {
    var dir = fs.readdirSync(jardir);
  } catch(err) {
    console.error(err);
    _push('');
    return;
  }

  _push('');
  dir.forEach(_push);

  function _push(fname) {
    var dir = path.normalize(jardir + fname);
    if (java) {
      java.classpath.push(dir);
    } else {
      classpath.push(dir); 
    }
  }
}


//
// 返回一个 classpath 字符串, 按平台特性连接多个路径
// 如果没有 classpath 则返回 null
//
function getClassPath() {
  var cp;
  if (java) {
    cp = java.classpath;
  } else {
    cp = classpath;
  }
  if (cp && cp.length > 0) {
    if (process.platform == 'win32') {
      return cp.join(';');
    } else {
      return cp.join(':');
    }
  }
  return;
}