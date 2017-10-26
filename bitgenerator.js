var randomBinary = require('random-binary');
var binary = '';
for (i = 0; i < 16; i++)
  binary += randomBinary(162);
console.log(binary);
