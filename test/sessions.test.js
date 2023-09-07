import chai from "chai";
import supertest from "supertest";
import app from "../src/server.js";
import usersModel from "../src/dao/models/users.model.js";
import productsModel from "../src/dao/models/products.model.js";
import cartsModel from "../src/dao/models/carts.models.js";
import bcrypt from "bcrypt";

const expect = chai.expect;
const requester = supertest(app);

describe("Testing para Sessions Router", () => {
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
    // Eliminar el usuario premium,el producto y el cart asociado, creados para las pruebas
    await usersModel.findByIdAndDelete(premiumUser._id);
    await productsModel.deleteMany({ owner: premiumUser._id });
    await cartsModel.deleteOne(cid);
    // Eliminar el usuario "Francisco Bilbao" y su carrito creado para las pruebas
    const franciscoUser = await usersModel.findOne({email: "francisco@gmail.com"});
    if (franciscoUser) {
      await usersModel.findByIdAndDelete(franciscoUser._id);
      await cartsModel.deleteOne(franciscoUser.cartId);
    }
    process.exit();
  });

  it("Registrar a un usuario", async () => {
    // Realizar la solicitud para registrar un nuevo usuario
    const hashedPassword = await bcrypt.hash("1234", 10);

    const result = await requester.post("/api/sessions/signup").send({
      first_name: "Francisco",
      last_name: "Bilbao",
      age: 38,
      cartId: cid,
      email: "francisco@gmail.com",
      password: hashedPassword,
    });

    // Verificar que la respuesta sea exitosa y contenga la información esperada
    expect(result.statusCode).to.be.equal(200);
    expect(result.body.message).to.equal("User registered");
    // ... otras verificaciones ...
  });

  it("Iniciar sesión con un usuario registrado", async () => {
    const response = await requester
      .post("/api/sessions/signin")
      .send({ email: premiumUser.email, password: "1234" });

    expect(response.status).to.equal(200);
    expect(response.body.status).to.equal("success");
    expect(response.body.message).to.equal("Bienvenido a Pets");
  });

  it("Indicar el perfil del usuario actual en sesión", async () => {
    const sessionCookie = loginResponse.header["set-cookie"];
    const response = await requester
      .get("/api/sessions/current")
      .set("Cookie", sessionCookie);

    expect(response.status).to.equal(200);
    expect(response.body.email).to.equal(premiumUser.email);
    expect(response.body.role).to.equal(premiumUser.role);
  });
});
