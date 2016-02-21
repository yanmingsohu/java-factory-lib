var tool     = require('../index.js');
var fs       = require('fs');
var path     = require('path');
var jfactory = tool.init();
var java     = jfactory.getJavaInstance();


var src = __dirname + '/src/';
var bin = __dirname + '/bin/';

mkdir(src);
mkdir(src + 'a');
// mkdir(bin);


//
// 创建一个java 代码, 编译运行, 之后删除所有临时文件/目录
//
var java_code = '                       \
  package a;                            \
                                        \
  public class b {                      \
    public static void h() {            \
      System.out.println("Java run");   \
    }                                   \
  }                                     \
';

var prop_code = 'istest=true';

fs.writeFileSync(src + 'a/b.java', java_code);
fs.writeFileSync(src + 'a/b.prop', prop_code);


tool.compile(src, bin, function(err, msg) {
  console.log(err || msg);
  jfactory.loadjar(bin);

  if (!err) {
    var b = java.import('a.b');

    b.h(function(err) {
      console.log(err || 'Test ok, delete temp files.');
      _del();
    });
  } else {
    _del();
  }

  function _del() {
    del(src + 'a/b.java');
    del(src + 'a/b.prop');
    del(0, src + 'a');
    del(0, src);
    
    del(bin + 'a/b.class');
    del(bin + 'a/b.prop');
    del(0, bin + 'a');
    del(0, bin);
  }
});


function mkdir(f) {
  try {
    fs.mkdirSync(f);
  } catch(e) {
    console.log(e);
  }
}


function del(f, d) {
  try {
    if (f) {
      fs.unlinkSync(f);
    }
    else if (d) {
      fs.rmdirSync(d);
    }
  } catch(e) {
    console.log(e)
  }
}