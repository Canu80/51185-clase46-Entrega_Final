import {createHash,validatePassword,generateEmailToken,verifyEmailToken,} from "../utils.js";
import usersModel from "../dao/models/users.model.js";
import {CreateCurrentUserDto,GetCurrentUserDto} from "../dao/dto/user.dto.js";
import {sendRecoveryPass} from "../helpers/utils/emails.js";

const sessionsController = {};

// Crear cuenta
sessionsController.singup = async (req, res) => {
  req.session.user = {
    first_name: req.user.first_name,
    last_name: req.user.last_name,
    age: req.user.age,
    email: req.user.email,
    role: req.user.role,
  };
  req.user.last_connection = new Date();
  await req.user.save();
  res.send({ status: "succes", message: "User registered" });
  req.logger.info("Usuario registrado con éxito");
};

// Error al crear cuenta
sessionsController.failsignup = async (req, res) => {
  req.logger.warn("Fallo en el registro");
  res.send({ error: "Error en el registro" });
};

// Iniciar sesión
sessionsController.signin = async (req, res) => {
  if (!req.user)
    return res
      .status(400)
      .send({ status: "error", error: "Invalid credentials" });

  req.session.user = {
    first_name: req.user.first_name,
    last_name: req.user.last_name,
    age: req.user.age,
    email: req.user.email,
    role: req.user.role,
    avatar: req.user.avatar
  };
  req.user.last_connection = new Date();
  await req.user.save();
  res.send({
    status: "success",
    payload: req.user,
    message: "Bienvenido a Pets",
  });
  req.logger.info("Un usuario ha iniciado sesión");
};

// Error al iniciar sesión
sessionsController.failsignin = async (req, res) => {
  req.logger.warn("Fallo en el ingreso");
  res.send({ error: "Error en el ingreso" });
};

// Hacemos un reseteo del password
sessionsController.resetPassword = async (req, res) => {
  try {
    const token = req.query.token;
    const { email, newPassword } = req.body;

    //validamos el token
    const validEmail = verifyEmailToken(token);
    if (!validEmail) {
      return res.send(`El enlace ya no es valido, genere uno nuevo: <a href="/forgotpassword">Nuevo enlace</a>.`);
    }
    const user = await usersModel.findOne({ email: email });
    if (!user) {
      return res.send("El usuario no esta registrado.");
    }
    if (validatePassword(newPassword, user)) {
      return res.send("No puedes usar la misma contraseña.");
    }
    const userData = {
      ...user._doc,
      password: createHash(newPassword),
    };
    const userUpdate = await usersModel.findOneAndUpdate(
      { email: email },
      userData
    );
    res.render("signin", { message: "contraseña actualizada" });
  } catch (error) {
    res.send(error.message);
  }
};

// Por si olvidó su password
sessionsController.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await usersModel.findOne({ email: email });
    if (!user) {
      return res.send(`<div>Error, <a href="/forgotpassword">Intente de nuevo</a></div>`);
    }
    const token = generateEmailToken(email, 3 * 60);
    console.log(token)
    await sendRecoveryPass(email, token);
    console.log(email)
    res.send(
      "Se envio un correo a su cuenta para restablecer la contraseña, volver <a href='/'>al login</a>"
    );
  } catch (error) {
    return res.send(`<div>Error, <a href="/forgotpassword">Intente de nuevo</a></div>`);
  }
};

// Se registra con GitHub
sessionsController.github = async (req, res) => {};

sessionsController.githubcallback = async (req, res) => {
  req.session.user = await req.user;
  res.redirect("/profile");
};

// Destruye la sesión
sessionsController.logout = async (req, res, next) => {
  await req.session.destroy((err) => {
    if (err) return next(err);
    req.logger.info("Se ha cerrado la sesión del usuario");
    res.redirect("/signin");
  });
};

// Muestra el perfil del usuario actualmente logueado
sessionsController.current = (req, res) => {
  let { first_name, last_name, email, age, role } = req.session.user;
  let newUser = new CreateCurrentUserDto({
    first_name,
    last_name,
    email,
    age,
    role
  });
  let user = new GetCurrentUserDto(newUser);
  console.log(user)
  res.send(user);
};

export default sessionsController;