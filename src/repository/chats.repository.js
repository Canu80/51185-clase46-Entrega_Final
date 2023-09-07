import {cartsDao, productsDao, chatsDao} from "../dao/factory.js"

const chatsServices = {};

// Obtener todos los carritos
chatsServices.getCarts = async () => {
    return await chatsDao.getChats();
};
// Agregamos un chat
chatsServices.addChat = async (data) => {
    return await chatsDao.addChat();    
  };  

export default chatsServices;
