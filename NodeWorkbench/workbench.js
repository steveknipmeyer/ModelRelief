// Learnings:
// async methods returns Promises!
// In an async method, await may be used to get the Promise result.
// Outside an async method, a Promise must be resolved using Promise.then.

function worker () {

    return new Promise((resolve, reject) => {
        resolve(1);
    });
}

async function incrementWorker() {

    return new Promise(async(resolve) => {

        // The method worker() is an async method so we can use await to get the result.
        let result =   await worker();
        resolve(result + 1);
    });
}

// 'await harness()' cannot be called because the calling context is not an async method.
// So, it is necessary to use Promise.then() to obtain the resolved result of the call.
incrementWorker().then(result => {
    console.log(`harness = ${result}`);
});

// This construction avoids the use of an (ESLint error) async Promise executor as in harness (above).

// https://eslint.org/docs/rules/no-async-promise-executor
// If a Promise executor function is using await, this is usually a sign that it is not actually necessary to use the new Promise constructor,
// or the scope of the new Promise constructor can be reduced.

worker().then(result => {
    result += 1;
    console.log (`harnessPrime = ${result}`);
});

// ----------------------------------------------------------------------------------------------------------------------------------------//
function sleep(ms) {

    // resolve Promise after delay of ms
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function demo() {

    console.log("Sleeping...");
    // The method sleep() returns a Promise so it is an async methof so we can use await to get the result.
    await sleep(2000);
    console.log("Two seconds later");
    return "Stephen";
}

// The method demo() returns a promise because it is an asyc method.
let demoResult = demo();
console.log (`demoResult = ${demoResult}'`);

// The result of demo() is known after waiting for the Promise to settbe resolved.
demoResult.then(v => {
    console.log(`harness = ${v}`);
});

