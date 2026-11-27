// Variables para las pruebas de integración. DATABASE_URL debe apuntar a una base SOLO de pruebas:
// las pruebas borran todos sus datos.
process.env.DATABASE_URL ??= "postgresql://auralight@localhost:5432/auralight_test";
process.env.JWT_ACCESS_SECRET = "prueba-access-secret-0123456789";
process.env.JWT_REFRESH_SECRET = "prueba-refresh-secret-0123456789";
process.env.WEB_ORIGIN = "http://localhost:3000";
process.env.CLOUDINARY_CLOUD_NAME = "demo-auralight";
process.env.CLOUDINARY_API_KEY = "123456";
process.env.CLOUDINARY_API_SECRET = "secreto-de-prueba";
process.env.CLOUDINARY_FOLDER = "auralight";
