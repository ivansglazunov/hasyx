require('dotenv').config();
console.log('1. Loading debug...');
const Debug = require('./lib/debug.ts');
console.log('2. Debug loaded');
const debug = Debug('test');
console.log('3. Debug instance created');
debug('test message');
console.log('4. Done');
