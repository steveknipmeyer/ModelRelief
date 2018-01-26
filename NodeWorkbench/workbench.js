// Learnings:
// async methods returns Promises!
// In an async method, await may be used to get the Promise result.
// Outside an async method, a Promise must be resolved using Promise.then.

console.log("hello, Node....");

function worker () {
    return new Promise((resolve, reject) => {
        
        resolve(1);
    })
}

async function harness() {

    return new Promise(async(resolve) => {
        // The method worker() is an async method so we can use await to get the result.
        let result =   await worker();
        console.log(`result = ${result}`);
    
        resolve(result + 1);
    })
}

// The method harness() cannot be called using await because the context of the calling method is not an async method.
// So, it is necessary to use Promise.then() to obtain the resolved result of the call.
let result = harness().then(v => {
    console.log(`harness = ${v}`);
})


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
  
async function demo() {
    console.log('Taking a break...');
    // The method sleep() is an async method so we can use await to get the result.
    await sleep(2000);
    console.log('Two second later');
    return 'Stephen';
}
  
// The method demo() returns a promise because it is an asyc method.
let demoResult = demo();
console.log (`demoResult = ${demoResult}'`);

// The result of demo() is known after waiting for the Promise to settle.
demoResult.then(v => {
    console.log(`harness = ${v}`);
})

