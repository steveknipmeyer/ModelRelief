// Learnings:
// async methods returns Promises.
// Promises may be resolved with await.
// Outside an async method, a Promise must be resolved using Promise.then.

const { hasOnlyExpressionInitializer } = require("typescript");

exports.test = function() {

    function sleep(ms) {

        // resolve Promise after delay of ms
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function getName() {

        console.log("Sleeping...");
        // The method sleep() returns a Promise so it is an async methof so we can use await to get the result.
        await sleep(2000);
        console.log("Two seconds later");
        return "Stephen";
    }

    // The getName demo() returns a promise because it is an asyc method.
    let getNameFunctionCall = getName();
    console.log(`getNameFunctionCall = ${getNameFunctionCall}'`);

    // The result of getNameFunctionCall() is known after waiting for the Promise to tbe resolved.
    getNameFunctionCall.then(name => {
        console.log(`(then) name = ${name}`);
    });

    async function harness() {
        const name = await getName();
        console.log(`(await) name = ${name}`);
    }
    harness().then();
};
