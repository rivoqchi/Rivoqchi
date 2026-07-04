import { execSync } from "node:child_process";

const PORTS = [4000, 3001];

function freePort(port) {
  try {
    const output = execSync(`lsof -ti tcp:${port}`, {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();

    if (!output) return;

    const pids = [...new Set(output.split("\n").filter(Boolean))];

    for (const pid of pids) {
      try {
        process.kill(Number(pid), "SIGTERM");
        console.log(`↻ Port ${port} band edi — jarayon ${pid} to'xtatildi`);
      } catch {
        // already gone
      }
    }
  } catch {
    // port bo'sh
  }
}

for (const port of PORTS) {
  freePort(port);
}

// Portlar to'liq bo'shashi uchun qisqa kutish
await new Promise((resolve) => setTimeout(resolve, 400));
