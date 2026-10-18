/** Keep the disposable ledger alive until each already-started gateway operation
 * has recorded its settlement or unknown outcome. Closing an HTTP socket is not
 * evidence that its provider request has finished. */
export class ManualRequestDrain {
  private stopping = false;
  private readonly pending = new Set<Promise<unknown>>();
  wrap<Args extends unknown[], Result>(
    request: (...args: Args) => Promise<Result>,
  ) {
    return (...args: Args): Promise<Result> => {
      if (this.stopping)
        return Promise.reject(
          new Error("Manual test is draining paid requests"),
        );
      const work = Promise.resolve().then(() => request(...args));
      this.pending.add(work);
      void work.then(
        () => this.pending.delete(work),
        () => this.pending.delete(work),
      );
      return work;
    };
  }
  async drain(timeoutMs = 15 * 60_000) {
    this.stopping = true;
    if (!this.pending.size) return;
    let timer: ReturnType<typeof setTimeout>;
    try {
      await Promise.race([
        Promise.allSettled([...this.pending]),
        new Promise<never>((_, reject) => {
          timer = setTimeout(
            () =>
              reject(
                new Error(
                  "Paid requests are still active; keep the disposable database and workspace for reconciliation",
                ),
              ),
            timeoutMs,
          );
        }),
      ]);
    } finally {
      clearTimeout(timer!);
    }
  }
}
