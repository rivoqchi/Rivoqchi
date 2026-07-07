import { execSync, spawn } from "node:child_process";
import http from "node:http";
import os from "node:os";

const BACKEND_URL = process.env.BACKEND_URL ?? "http://127.0.0.1:4000";
const FRONTEND_PORT = Number(process.env.FRONTEND_PORT ?? 3001);
const FRONTEND_HOST = process.env.FRONTEND_HOST ?? "0.0.0.0";

function getLanIp() {
  const nets = os.networkInterfaces();
  for (const entries of Object.values(nets)) {
    for (const net of entries ?? []) {
      if (net.family === "IPv4" && !net.internal) {
        return net.address;
      }
    }
  }
  return null;
}

function probe(url) {
  return new Promise((resolve) => {
    const req = http.get(url, { timeout: 2500 }, (res) => {
      res.resume();
      resolve({
        ok: true,
        status: res.statusCode,
        poweredBy: res.headers["x-powered-by"] ?? "",
      });
    });

    req.on("error", () => resolve({ ok: false }));
    req.on("timeout", () => {
      req.destroy();
      resolve({ ok: false });
    });
  });
}

function freePort(port) {
  try {
    const output = execSync(`lsof -ti tcp:${port}`, {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();

    if (!output) return false;

    for (const pid of output.split("\n").filter(Boolean)) {
      try {
        process.kill(Number(pid), "SIGTERM");
        console.log(`↻ Port ${port} band edi — jarayon ${pid} to'xtatildi`);
      } catch {
        // already gone
      }
    }
    return true;
  } catch {
    return false;
  }
}

function isPortInUse(port) {
  try {
    execSync(`lsof -ti tcp:${port}`, { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}

const lanIp = getLanIp();
const frontendUrl = `http://127.0.0.1:${FRONTEND_PORT}`;

console.log("\n--- CV dev ---");
console.log(`Kompyuter:  http://localhost:${FRONTEND_PORT}`);
if (lanIp) {
  console.log(`Telefon:    http://${lanIp}:${FRONTEND_PORT}`);
  console.log("(Telefon va kompyuter bir Wi‑Fi da bo'lishi kerak)\n");
} else {
  console.log("Telefon:    Wi‑Fi IP topilmadi\n");
}

const [backendHealth, frontendProbe] = await Promise.all([
  probe(`${BACKEND_URL}/api/v1/content/uz`),
  probe(frontendUrl),
]);

const frontendRunning =
  frontendProbe.ok && String(frontendProbe.poweredBy).includes("Next.js");

if (frontendRunning) {
  console.log(`✓ Frontend allaqachon ishlayapti: ${frontendUrl}`);
  if (backendHealth.ok && backendHealth.status < 400) {
    console.log(`✓ Backend ${BACKEND_URL} tayyor`);
  } else {
    console.warn(
      `⚠️  Backend ${BACKEND_URL} javob bermayapti — root papkadan npm run dev ishlating.`,
    );
  }
  console.log(
    "\nIkkinchi marta ishga tushirish shart emas.",
    "To'xtatish uchun avvalgi terminalda Ctrl+C bosing.\n",
  );
  process.exit(0);
}

if (isPortInUse(FRONTEND_PORT)) {
  const freed = freePort(FRONTEND_PORT);
  if (freed) {
    await new Promise((resolve) => setTimeout(resolve, 400));
  }
}

if (!backendHealth.ok || backendHealth.status >= 400) {
  console.warn(
    `⚠️  Backend ${BACKEND_URL} hali tayyor emas.`,
    "Faqat frontend kerak bo'lsa ham ishlaydi; ma'lumot uchun root papkada npm run dev ishlating.\n",
  );
} else {
  console.log(`✓ Backend ${BACKEND_URL} tayyor\n`);
}

const nextBin = new URL("../node_modules/next/dist/bin/next", import.meta.url)
  .pathname;

const child = spawn(
  process.execPath,
  [nextBin, "dev", "--port", String(FRONTEND_PORT), "--hostname", FRONTEND_HOST],
  { stdio: "inherit", env: process.env },
);

child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }
  process.exit(code ?? 0);
});
