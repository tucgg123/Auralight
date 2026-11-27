/** Pruebas de integración contra PostgreSQL real (DATABASE_URL de prueba). */
module.exports = {
  moduleFileExtensions: ["js", "json", "ts"],
  rootDir: ".",
  testRegex: ".e2e-spec.ts$",
  transform: { "^.+\\.ts$": "ts-jest" },
  testEnvironment: "node",
  setupFiles: ["<rootDir>/entorno-prueba.ts"],
  globalSetup: "<rootDir>/preparar-bd.js",
  testTimeout: 30000,
};
