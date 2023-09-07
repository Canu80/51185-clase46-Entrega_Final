import { ticketsDao } from "../dao/factory.js";

const ticketsServices = {};

// Recibo todos los tickets del usuario
ticketsServices.getUserTickets = async (userEmail) => {
  return ticketsDao.getUserTickets(userEmail);
}

// Recibo el ticket en base a su ID
ticketsServices.getTicketByID = async (tid) => {
  return ticketsDao.getTicketByID(tid);
};

// Creamos un nuevo ticket
ticketsServices.createTicket = async (newTicket) => {
  return ticketsDao.createTicket(newTicket);
};

export default ticketsServices;
