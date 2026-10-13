import { startVmAgent } from "./runtime.js";

const runtime = await startVmAgent();

console.log(`LiveWorkflow VM agent started for host ${runtime.vmHostId}`);

for (const signal of ["SIGINT", "SIGTERM"] as const) {
  process.once(signal, () => {
    void runtime.close().finally(() => {
      process.exit(0);
    });
  });
}
