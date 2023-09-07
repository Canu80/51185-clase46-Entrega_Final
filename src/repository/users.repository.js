import { usersDao } from "../dao/factory.js";

const usersServices = {};

// Recibo todos los usuarios
usersServices.getUsers = async () => {
  return await usersDao.getUsers();
};

export default usersServices;
