import http from "node:http";
import os from "node:os";

const BACKEND_URL = process.env.BACKEND_URL ?? "http://127.0.0.1:4000";
const FRONTEND_PORT = Number(process.env.FRONTEND_PORT ?? 3001);

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

const backendHealth = await probe(`${BACKEND_URL}/api/v1/content/uz`);
const port3000 = await probe("http://127.0.0.1:3000/");
const lanIp = getLanIp();

console.log("\n--- CV dev ---");
console.log(`Kompyuter:  http://localhost:${FRONTEND_PORT}`);
if (lanIp) {
  console.log(`Telefon:    http://${lanIp}:${FRONTEND_PORT}`);
  console.log("(Telefon va kompyuter bir Wi‑Fi da bo'lishi kerak)\n");
} else {
  console.log("Telefon:    Wi‑Fi IP topilmadi\n");
}

if (port3000.ok && String(port3000.poweredBy).includes("Next.js")) {
  console.warn(
    "⚠️  Port 3000 band. Backend 4000, frontend 3001 ishlatiladi.\n",
  );
}

if (!backendHealth.ok || backendHealth.status >= 400) {
  console.warn(
    `⚠️  Backend ${BACKEND_URL} hali tayyor emas — biroz kuting yoki alohida ishga tushiring.\n`,
  );
} else {
  console.log(`✓ Backend ${BACKEND_URL} tayyor\n`);
}
