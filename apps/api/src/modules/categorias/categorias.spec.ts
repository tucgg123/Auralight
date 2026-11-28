import { slugDe } from "./categorias.service";

describe("slugDe", () => {
  it("quita tildes, espacios y mayúsculas", () => {
    expect(slugDe("Cadenas y Dijes")).toBe("cadenas-y-dijes");
    expect(slugDe("  Piñatas Únicas! ")).toBe("pinatas-unicas");
  });
});
