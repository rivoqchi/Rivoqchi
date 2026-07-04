import { execSync } from "node:child_process";

const port = process.argv[2] ?? "4000";

try {
  const output = execSync(`lsof -ti tcp:${port}`, {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "ignore"],
  }).trim();

  if (output) {
    for (const pid of output.split("\n").filter(Boolean)) {
      try {
        process.kill(Number(pid), "SIGTERM");
        console.log(`↻ Port ${port} — jarayon ${pid} to'xtatildi`);
      } catch {
        // ignore
      }
    }
    await new Promise((resolve) => setTimeout(resolve, 300));
  }
} catch {
  // port bo'sh
}
