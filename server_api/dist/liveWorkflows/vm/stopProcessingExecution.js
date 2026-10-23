/** Docker --rm may remove the container before `stop`; the execution receipt must still finish. */
export async function stopProcessingExecution(stop, done) {
    try {
        await stop();
    }
    catch (error) {
        if (!(error instanceof Error) || !/No such container:/i.test(error.message))
            throw error;
    }
    let timer;
    try {
        await Promise.race([
            done,
            new Promise((_resolve, reject) => {
                timer = setTimeout(() => reject(new Error("Processing execution did not finish after stop; reconcile before resuming")), 15000);
            }),
        ]);
    }
    finally {
        clearTimeout(timer);
    }
}
