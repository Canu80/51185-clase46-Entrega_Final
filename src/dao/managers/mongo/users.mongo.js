import usersModel from "../../models/users.model.js";


export class UsersMongo {
  
  // Recibo todos los carritos
  getUsers = async () => {
    const users = await usersModel.find({}, "first_name last_name email role");
    if (!users) {
      return {
        code: 400,
        status: "Error",
        message: "No se han encontrado usuarios",
      };
    };
    return {
      code: 202,
      status: "Success",
      message: users,
    };
  };
  
};
