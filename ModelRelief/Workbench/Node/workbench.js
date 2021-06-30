// Learnings:
// async methods returns Promises!
// In an async method, await may be used to get the Promise result.
// Outside an async method, a Promise must be resolved using Promise.then.

const promiseA = require("./promiseA");
const promiseB = require("./promiseB");

// promiseA.test();
promiseB.test();
