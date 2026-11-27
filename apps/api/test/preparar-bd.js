// Aplica las migraciones a la base de pruebas antes de correr las pruebas de integración.
const { execSync } = require("node:child_process");

module.exports = async () => {
  const url = process.env.DATABASE_URL ?? "postgresql://auralight@localhost:5432/auralight_test";
  if (!/test/.test(url)) throw new Error("Por seguridad, la base de pruebas debe tener 'test' en su nombre.");
  execSync("pnpm exec prisma migrate deploy", { stdio: "inherit", env: { ...process.env, DATABASE_URL: url } });
};
