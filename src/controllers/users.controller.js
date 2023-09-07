import usersModel from "../dao/models/users.model.js";
import productsModel from "../dao/models/products.model.js";
import usersServices from "../repository/users.repository.js";
import { sendDeleteAccount, deleteAccount } from "../helpers/utils/emails.js";

const usersController = {};

// Cambio del rol de usuario
usersController.roleChange = async (req, res) => {
  try {
    const userId = req.query.uid;
    //verificar si el usuario existe en la base de datos
    const user = await usersModel.findById(userId);
    const userRole = user.role;
    const userStatus = user.status;

    if (userRole === "Usuario") {
      if (userStatus !== "completo") {
        return res.json({
          status: "error",
          message:
            "El usuario debe completar todos los documentos requeridos antes de convertirse en Premium",
        });
      }
      user.role = "Premium";
    } else if (userRole === "Premium") {
      user.role = "Usuario";
    } else {
      return res.json({
        status: "error",
        message: "No es posible cambiar el rol del usuario",
      });
    }
    await usersModel.updateOne({ _id: user._id }, user);
    res.send({ status: "success", message: "rol modificado" });
  } catch (error) {
    console.log(error.message);
    res.json({
      status: "error",
      message: "hubo un error al cambiar el rol del usuario",
    });
  }
};

// Subir documento de usuario
usersController.updateUserDocument = async (req, res) => {
  try {
    const userId = req.params.uid;
    const user = await usersModel.findById(userId);
    const identification = req.files["identification"]?.[0] || null;
    const address = req.files["address"]?.[0] || null;
    const accountStatus = req.files["accountStatus"]?.[0] || null;
    const docs = [];
    if (identification) {
      docs.push({ name: "identification", reference: identification.filename });
    }
    if (address) {
      docs.push({ name: "address", reference: address.filename });
    }
    if (accountStatus) {
      docs.push({ name: "accountStatus", reference: accountStatus.filename });
    }
    if (docs.length === 3) {
      user.status = "completo";
    } else {
      user.status = "incompleto";
    }
    user.documents = docs;
    const userUpdate = await usersModel.findByIdAndUpdate(user._id, user);

    res.json({ status: "success", message: "Documentos actualizados" });
  } catch (error) {
    console.log(error.message);
    res.json({
      status: "error",
      message: "Hubo un error en la carga de los archivos.",
    });
  }
};

// Subir imagen de producto
usersController.uploadProductImage = async (req, res) => {
  try {
    const { uid } = req.params;
    const updatedProduct = await productsModel.findByIdAndUpdate(
      uid,
      { $set: { productImage: req.file.path } },
      { new: true }
    );
    res.send(updatedProduct);
  } catch (error) {
    res.status(500).send({ error: "Error al subir la imagen del producto" });
  }
};

// Obtener todos los usuarios
usersController.getUsers = async (req, res) => {
  try {
    const users = await usersServices.getUsers();
    res.status(users.code).send({
      status: users.status,
      message: users.message,
    });
  } catch (error) {
    res
      .status(500)
      .send({ error: "Error al intentar obtener todos los usuarios" });
  }
};

// Eliminar a los usuarios inactivos
usersController.deleteInactiveUsers = async (req, res) => {
  try {
    const inactiveUsers = await usersModel.find({
      last_connection: {
        $lt: new Date(Date.now() - 2 * 60 * 1000),
      },
    });
    if (inactiveUsers.length > 0) {
      for (const user of inactiveUsers) {
        await sendDeleteAccount(user.email);
        await usersModel.findByIdAndDelete(user._id);
      }
      return res.json({
        status: "success",
        message:
          "Usuarios inactivos fueron eliminados y notificados por correo electrónico.",
      });
    } else {
      return res.json({
        status: "success",
        message: "No se encontraron usuarios inactivos.",
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: "error",
      message: "Error al eliminar usuarios inactivos.",
    });
  }
};

// Eliminar a un usuario
usersController.deleteUser = async (req, res) => {
  try {
    const { uid } = req.params;
    const deletedUser = await usersModel.findByIdAndDelete(uid);
    if (deletedUser) {
      await deleteAccount(deletedUser.email);
      res.json({ status: "success", message: "Usuario eliminado con éxito" });
    } else {
      res
        .status(404)
        .json({ status: "error", message: "Usuario no encontrado" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: "Error al eliminar el usuario",
    });
  }
};

// Cambiar el rol de un usuario
usersController.changeUserRole = async (req, res) => {
  try {
    const { uid } = req.params;
    const { newRole } = req.body;

    // Verificar que newRole sea uno de los roles permitidos ("Usuario", "Premium", "Administrador")
    if (!["Usuario", "Premium", "Administrador"].includes(newRole)) {
      return res.status(400).json({
        status: "error",
        message: "Rol no válido",
      });
    }

    // Buscar y actualizar el rol del usuario en la base de datos
    const updatedUser = await usersModel.findByIdAndUpdate(
      uid,
      { role: newRole },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({
        status: "error",
        message: "Usuario no encontrado",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Rol de usuario actualizado con éxito",
      newRole: updatedUser.role,
    });
    
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: "Error al cambiar el rol del usuario",
    });
  }
};

export default usersController;
