var jfactory = require('../index.js').init();
var java = jfactory.getJavaInstance();


var List = java.import('java.util.ArrayList');
var arr = new List();

arr.addSync('a');
arr.addSync('b');
arr.addSync('c');

console.log(arr.toStringSync());