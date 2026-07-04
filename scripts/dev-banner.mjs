import os from "node:os";

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

const lanIp = getLanIp();

console.log("\n=== CV dev (backend + frontend) ===");
console.log("Kompyuter:  http://localhost:3001");
if (lanIp) {
  console.log(`Telefon:    http://${lanIp}:3001`);
}
console.log(
  "Eslatma: faqat shu terminalda ishga tushiring.",
  "f/ ichida alohida npm run dev kerak emas.\n",
);
