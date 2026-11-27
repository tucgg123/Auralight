import { hoyEnColombia } from "./ferias.service";

describe("hoyEnColombia", () => {
  it("a las 11 p. m. en Bogotá sigue siendo el mismo día (aunque en UTC ya sea mañana)", () => {
    expect(hoyEnColombia(new Date("2026-11-27T04:00:00Z")).toISOString()).toBe("2026-11-26T00:00:00.000Z");
  });

  it("a la medianoche de Bogotá cambia de día", () => {
    expect(hoyEnColombia(new Date("2026-11-27T05:00:00Z")).toISOString()).toBe("2026-11-27T00:00:00.000Z");
  });
});
