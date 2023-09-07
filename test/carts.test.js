import chai from "chai";
import supertest from "supertest";
import app from "../src/server.js";
import usersModel from "../src/dao/models/users.model.js";
import productsModel from "../src/dao/models/products.model.js";
import cartsModel from "../src/dao/models/carts.models.js";
import bcrypt from "bcrypt";

const expect = chai.expect;
const requester = supertest(app);

describe("Testing para Carts Router", () => {
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
    cid = cart._id;
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

    // Crear un carrito para ser utilizado en las pruebas
    //createdCart = await cartsModel.create({ products: [] });
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

  it("Obtener todos los carritos", async () => {
    // Obtener la cookie de sesión del usuario creado
    const sessionCookie = loginResponse.header["set-cookie"];

    // Realizar la solicitud para obtener todos los carritos
    const result = await requester
      .get("/api/carts")
      .set("Cookie", sessionCookie);

    // Verificar que la respuesta
    expect(result.statusCode).to.be.equal(202);
    expect(Array.isArray(result.body.message)).to.deep.equal(true);
  });

  it("Agregar un producto al carrito del usuario Premium", async () => {
    // Realizar la solicitud para agregar un producto al carrito del usuario Premium
    const sessionCookie = loginResponse.header["set-cookie"];
    const result = await requester
      .post(
        `/api/carts/${
          premiumUser.cartId
        }/products/${createdProduct._id.toString()}`
      )
      .send({ quantity: 3 })
      .set("Cookie", sessionCookie);

    // Verificar que la respuesta
    expect(result.statusCode).to.be.equal(202);
    expect(Array.isArray(result.body.message.products)).to.equal(true);
  });

  it("Eliminar un producto del carrito", async () => {
    // Obtener la cookie de sesión del usuario creado
    const sessionCookie = loginResponse.header["set-cookie"];
    const productId = createdProduct._id.toString();

    // Realizar la solicitud para eliminar un producto del carrito
    const result = await requester
      .delete(`/api/carts/${cid}/products/${productId}`)
      .set("Cookie", sessionCookie);

    // Verificar que la respuesta
    expect(result.statusCode).to.be.equal(302);
  });
});
