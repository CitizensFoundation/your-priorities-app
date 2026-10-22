/** Docker --rm may remove the container before `stop`; the execution receipt must still finish. */
export async function stopProcessingExecution(
  stop: () => Promise<unknown>,
  done: Promise<void>,
) {
  try {
    await stop();
  } catch (error) {
    if (!(error instanceof Error) || !/No such container:/i.test(error.message))
      throw error;
  }
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    await Promise.race([
      done,
      new Promise<never>((_resolve, reject) => {
        timer = setTimeout(
          () =>
            reject(
              new Error(
                "Processing execution did not finish after stop; reconcile before resuming",
              ),
            ),
          15_000,
        );
      }),
    ]);
  } finally {
    clearTimeout(timer);
  }
}
