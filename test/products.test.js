import chai from "chai";
import supertest from "supertest";
import app from "../src/server.js";
import usersModel from "../src/dao/models/users.model.js";
import productsModel from "../src/dao/models/products.model.js";
import cartsModel from "../src/dao/models/carts.models.js";
import bcrypt from "bcrypt";

const expect = chai.expect;
const requester = supertest(app);

describe("Testing para Products Router", () => {
  // Variables de entorno
  let premiumUser;
  let loginResponse;
  let createdProduct;
  let cid;

  before(async () => {
    // Encriptar el password
    const hashedPassword = await bcrypt.hash("1234", 10);

    // Crear un usuario con rol Premium
    const cart = await cartsModel.create({ products: [] });

    premiumUser = await usersModel.create({
      first_name: "Alfredo",
      last_name: "Figueroa",
      email: "alfredo@gmail.com",
      password: hashedPassword, // Usar la contraseña encriptada
      cartId: cart._id,
      role: "Premium",
    });
    cid = cart._id
    // Iniciar sesión con el usuario premium creado
    loginResponse = await requester
      .post("/api/sessions/signin")
      .send({ email: premiumUser.email, password: "1234" });

    // Crear un producto para ser modificado en el test
    createdProduct = await productsModel.create({
      title: "Producto a Modificar",
      description: "Descripción del producto a modificar",
      price: 1500,
      thumbnail: "imagen.png",
      code: "ABC123",
      stock: 50,
      category: "Categoría del producto a modificar",
      owner: premiumUser._id,
    });
  });

  beforeEach(async function () {
    this.timeout(10000);
  });
  after(async () => {
    // Eliminar el usuario premium y el producto creado para las pruebas
    await usersModel.findByIdAndDelete(premiumUser._id);
    await productsModel.deleteMany({ owner: premiumUser._id });
    await cartsModel.deleteOne(cid);
    process.exit();
  });

  it("Traer productos existentes", async () => {
    const mockRequest = {
      query: {
        limit: 10,
      },
    };
    const mockResponse = {
      json: (data) => {
        assert.ok(data.products.length > 0);
      },
    };
    const result = await requester.get("/api/products");
    expect(result.statusCode).to.be.equal(200);
    expect(Array.isArray(result.body.products.message)).to.deep.equal(true);
  });

  it("Crear un producto como usuario Premium", async () => {
    // Obtener la cookie de sesión del usuario creado
    const sessionCookie = loginResponse.header["set-cookie"];

    // Crear un producto utilizando la sesión de usuario premium
    const result = await requester
      .post("/api/products")
      .set("Cookie", sessionCookie)
      .send({
        title: "Nombre del producto - Test",
        description: "Descripción - Test",
        price: 1000,
        thumbnail: "Imagen - Test",
        code: "1000",
        stock: 100,
        category: "Categoría - Test",
      });

    // Verificar que la respuesta sea exitosa
    expect(result.statusCode).to.be.equal(201);
  });

  it("Modificar un producto", async () => {
    // Obtener la cookie de sesión del usuario creado
    const sessionCookie = loginResponse.header["set-cookie"];
    const idProduct = createdProduct._id.toString();

    // Modificar el producto creado en el test
    const result = await requester
      .put(`/api/products/${idProduct}`) // Ruta para modificar el producto
      .set("Cookie", sessionCookie)
      .send({
        title: "Producto Modificado",
        description: "Nueva descripción del producto modificado",
        price: 5000,
        thumbnail: "imagen.png",
        code: "ABC123",
        stock: 50,
        category: "Categoría del producto a modificar",
      });

    // Verificar que la respuesta sea exitosa
    expect(result.statusCode).to.be.equal(200);
    // Asegurarse de verificar la respuesta según la lógica de tu aplicación
  });
});
