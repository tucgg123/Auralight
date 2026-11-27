import { firmar } from "./cloudinary.service";

describe("firmar (Cloudinary)", () => {
  it("coincide con el ejemplo de la documentación de Cloudinary", () => {
    // https://cloudinary.com/documentation/authentication_signatures
    const firma = firmar(
      { eager: "w_400,h_300,c_pad|w_260,h_200,c_crop", public_id: "sample_image", timestamp: 1315060510 },
      "abcd",
    );
    expect(firma).toBe("bfd09f95f331f558cbd1320e67aa8d488770583e");
  });

  it("ordena las claves alfabéticamente", () => {
    expect(firmar({ b: 2, a: 1 }, "s")).toBe(firmar({ a: 1, b: 2 }, "s"));
  });
});
