// Learnings:
// async methods returns Promises.
// Promises may be resolved with await.
// Outside an async method, a Promise must be resolved using Promise.then.
// Promises should not use async executor methods. There are better designs.

exports.test = function () {

    // Promise implementation
    // function one() {

    //     return new Promise((resolve, reject) => {
    //         resolve(1);
    //     });
    // }

    // async implementation
    async function one() {
        return 1;
    }

    async function incrementOne() {

        return new Promise(async (resolve) => {
            // The method worker() is an async method so we can use await to get the result.
            let result = await one();
            resolve(result + 1);
        });
    }

    // 'await incrementWorker()' cannot be called because the calling context is not an async method.
    // So, it is necessary to use Promise.then() to obtain the resolved result of the call.
    incrementOne().then(result => {
        console.log(`incrementOne = ${result}`);
    });

    // This construction avoids the use of an (ESLint error) async Promise executor as in harness (above).
    // https://eslint.org/docs/rules/no-async-promise-executor
    // If a Promise executor function is using await, this is usually a sign that it is not actually necessary to use the new Promise constructor,
    // or the scope of the new Promise constructor can be reduced.

    one().then(result => {
        result += 1;
        console.log(`one + 1 = ${result}`);
    });
};
