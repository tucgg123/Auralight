import { formatearCodigo } from "./codigo";

describe("formatearCodigo", () => {
  it("rellena con ceros a 3 dígitos", () => {
    expect(formatearCodigo("A", 42)).toBe("A-042");
    expect(formatearCodigo("m", 7)).toBe("M-007");
  });

  it("no recorta consecutivos de más de 3 dígitos", () => {
    expect(formatearCodigo("C", 1234)).toBe("C-1234");
  });

  it("rechaza consecutivos inválidos", () => {
    expect(() => formatearCodigo("A", 0)).toThrow();
    expect(() => formatearCodigo("A", 1.5)).toThrow();
  });
});
