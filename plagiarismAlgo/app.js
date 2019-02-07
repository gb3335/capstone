const addon = require('./build/Release/plagiarism');

let arr=["a","his","her"];

let text = "ahisher";

let k = arr.length/arr[0].length;

console.time('c++');
let res = addon.search(arr,k,text);
console.timeEnd('c++');

console.log(res);