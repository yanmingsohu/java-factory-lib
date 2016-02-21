var java;

try {
  java = require('java');
} catch(e) {

  try {
    console.log('>> Cannot require `java` lib, install java.');
    var i = __dirname.indexOf('node_modules');

    if (i>0) {
      var cp = require('child_process');
      var dir = __dirname.substr(0, i);

      if (cp.execSync) {
        cp.execSync('npm install java', {
          cwd   : dir,
          stdio : 'inherit'
        });
      } else {
        cp.exec('npm install java', {
          cwd   : dir,
        }, function(error, stdout, stderr) {
          error  && console.error(error);
          stdout && console.log(stdout);
          stderr && console.error(stderr);
        });
      }
      
    } else {
      console.log('>> Fail! cannot find `node_modules` dir.');
    }
  } catch(err) {
    console.log('install java fail:', err);
  }
}