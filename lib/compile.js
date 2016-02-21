var cp   = require('child_process');
var fs   = require('fs');
var path = require('path');
var clib = require('configuration-lib');
var fact = require('./factory.js');


module.exports.compile = compile;


//
// 编译 java 源代码的工具
// 遍历 src_dir 中的 java 代码, 并编译到 out_dir 目录中
//
function compile(src_dir, out_dir, RCB) {
  var SUCCESS = 0;
  var cmd     = 'javac';
  var arg     = [ '-O', '-s', src_dir, '-d', out_dir, '-encoding', 'UTF8' ];
  var opt     = { stdio: 'inherit' };
  var count   = 0;
  var cpath   = fact.getClassPath();

  if (cpath) {
    arg.push('-cp');
    arg.push(cpath);
  }

  clib.mkdir(out_dir);


  loopdir(src_dir, function(err) {
    if (err) return RCB(err);

    var ret = [
      '> Java Compile All success.',
      "\n\t Src dir :", src_dir,
      "\n\t Out dir :", out_dir,
      "\n\t Total", count, " Sourse File Compile."
    ];
    RCB(null, ret.join(' '));
  });


  function loopdir(dir, _lnext) {
    fs.readdir(dir, function(err, dirs) {
      if (err) return RCB(err);
      
      var i = -1;
      _dnext();

      function _dnext(err) {
        if (err) return _lnext(err);

        if (++i < dirs.length) {
          var fname = path.join(dir, dirs[i]);
          var stats = fs.statSync(fname);

          if (stats.isDirectory()) {
            loopdir(fname, _dnext);
          } else {
            if (path.extname(fname).toLowerCase() == '.java') {
              _f_java(fname, _dnext);
            } else {
              _f_other(fname, _dnext);
            }
          }
        } else {
          _lnext();
        }
      }
    });
  }


  function _f_other(ifile, next) {
    var ofile = path.join(out_dir, ifile.substr(src_dir.length));
    var reader = fs.createReadStream(ifile);
    var writer = fs.createWriteStream(ofile);

    writer.on('finish', function() {
      console.log('> Copy', ifile);
      next();  
    });
    
    reader.pipe(writer);
  }


  function _f_java(jfile, next) {
    console.log('> Compile ' + jfile);

    arg.push(jfile);
    var evet = cp.spawn(cmd, arg, opt);

    evet.on('close', function (code, signal) {
      arg.pop();

      if (code === SUCCESS) {
        ++count;
        next();
      } else {
        var msg = '* Compile fail ' + jfile + ' ret code:' + code;
        next(new Error(msg));
      }
    });
  }
}