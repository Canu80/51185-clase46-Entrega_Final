import productsModel from "../dao/models/products.model.js";
import cartsServices from "../repository/carts.repository.js";
import ticketsServices from "../repository/tickets.repository.js";
import usersServices from "../repository/users.repository.js";


const viewsControler = {};

// Muestra el home
viewsControler.renderIndex = (req, res) => {
  res.render("index");
};

// Muestra todos los productos
viewsControler.renderProducts = async (req, res) => {
  const products = await productsModel.find().lean();
  res.render("products/all-products", { products });
};

// Muestra las mascotas encontradas
viewsControler.renderFound = (req, res) => {
  const foundPetsData = [
    {
      name: "Tomás",
      imageFilename: "001.jpg",
    },
    {
      name: "Max",
      imageFilename: "002.jpg",
    },
    {
      name: "Luna",
      imageFilename: "003.jpg",
    },
    {
      name: "Rocky",
      imageFilename: "004.jpg",
    },
    {
      name: "Bella",
      imageFilename: "005.jpg",
    },
    {
      name: "Coco",
      imageFilename: "006.jpg",
    },
    {
      name: "Simba",
      imageFilename: "007.jpg",
    },
    {
      name: "Daisy",
      imageFilename: "008.jpg",
    }
  ];
  res.render("found", { foundPets: foundPetsData });
};

// Muestra las mascotas perdidas
viewsControler.renderLost = (req, res) => {
  const lostPetsData = [
    {
      name: "Tomás",
      imageFilename: "01.jpg",
      age: 4,
      daysLost: 3,
      location: "comuna de Providencia, Santiago, Chile",
      contactNumber: "9 5648 9554",
    },
    {
      name: "Max",
      imageFilename: "02.jpg",
      age: 3,
      daysLost: 5,
      location: "comuna de Las Condes, Santiago, Chile",
      contactNumber: "9 6789 1234"
    },
    {
      name: "Luna",
      imageFilename: "03.jpg",
      age: 2,
      daysLost: 2,
      location: "comuna de Providencia, Santiago, Chile",
      contactNumber: "9 4321 9876"
    },
    {
      name: "Rocky",
      imageFilename: "04.jpg",
      age: 5,
      daysLost: 7,
      location: "comuna de Vitacura, Santiago, Chile",
      contactNumber: "9 3456 7890"
    },
    {
      name: "Bella",
      imageFilename: "05.jpg",
      age: 1,
      daysLost: 1,
      location: "comuna de Ñuñoa, Santiago, Chile",
      contactNumber: "9 6789 0123"
    },
    {
      name: "Coco",
      imageFilename: "06.jpg",
      age: 2,
      daysLost: 4,
      location: "comuna de Ñuñoa, Santiago, Chile",
      contactNumber: "9 5678 9012"
    },
    {
      name: "Simba",
      imageFilename: "07.jpg",
      age: 3,
      daysLost: 6,
      location: "comuna de Huechuraba, Santiago, Chile",
      contactNumber: "9 4567 8901"
    },
    {
      name: "Daisy",
      imageFilename: "08.jpg",
      age: 4,
      daysLost: 2,
      location: "comuna de Ñuñoa, Santiago, Chile",
      contactNumber: "9 3456 7890"
    }
  ];
  res.render("lost", { lostPets: lostPetsData });
};

// Muestra el acerca de nosotros
viewsControler.renderContact = (req, res) => {
  res.render("contact");
};

// Manejar el envío del formulario de contacto
viewsControler.sendConsult = (req, res) => {
  res.redirect('/contact');
};

// Muestra el carrito asociado a la sesión
viewsControler.renderMyCart = async (req, res) => {
  if (!req.user)
    return res
      .status(400)
      .send({ status: "error", error: "Invalid credentials" });
  const cid = req.user.cartId.toString();
  const myCart = await cartsServices.getCartByID(cid);

  if (!myCart || myCart.message.length === 0) {
    // Manejo del error si no se pudo obtener el carrito
    return res.status(500).json({ error: "Error al obtener el carrito" });
  }
  const cart = myCart.message[0];
  const products = cart.products;
  const productDetails = products.map((product) => {
    return {
      pid: product.product._id.toString(),
      title: product.product.title,
      price: product.product.price,
      thumbnail: product.product.thumbnail,
      stock: product.product.stock,
      description: product.product.description,
      quantity: product.quantity,
      cid: cid,
    };
  });
  res.render("mycart", { products: productDetails, cid: cid });
};

// Muestra el formulario de registro
viewsControler.renderSignUpForm = (req, res) => {
  res.render("signup");
};

// Muestra el formulario de inicio de sesión
viewsControler.renderSignInFrom = (req, res) => {
  res.render("signin");
};

// Muestra el perfil del usuario
viewsControler.renderSignProfile = (req, res) => {
  res.render("profile", { user: req.session.user });
};

// Muestra los tickets asociados al usuario
viewsControler.renderSignTickets = async (req, res) => {
  try {
    const userEmail = req.user.email;
    const userTicketsResponse = await ticketsServices.getUserTickets(userEmail);
    if (userTicketsResponse.code === 200) {
      const userTickets = userTicketsResponse.message.map((ticket) => ({
        code: ticket.code,
        purchase_datetime: ticket.purchase_datetime,
        amount: ticket.amount,
      }));
      res.render("userTickets", { tickets: userTickets });
    } else {
      res.render("userTickets", { tickets: [] });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Muestra el formulario para restablecer la contraseña
viewsControler.renderResetPassword = (req, res) => {
  const token = req.query.token;
  res.render("resetpassword", { token });
};

// Muestra el formulario para restablecer la contraseña
viewsControler.renderForgotPassword = (req, res) => {
  res.render("forgotPassword");
};

// Muestra el listado de usuarios (solo para usuarios administradores)
viewsControler.renderUsers = async (req, res) => {
  try {
    const usersResponse = await usersServices.getUsers();

    if (usersResponse.status === "Success") {
      const users = usersResponse.message.map((user) => ({
        nombre: `${user.first_name} ${user.last_name}`,
        email: user.email,
        rol: user.role,
        _id: user._id,
      }));
      console.log(users);
      res.render("users", { users });
    } else {
      // Manejar el caso de error
      res.status(500).send({ error: "Error al cargar la lista de usuarios" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Error al cargar la lista de usuarios" });
  }
};

export default viewsControler;
