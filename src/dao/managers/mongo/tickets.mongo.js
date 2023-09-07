import ticketsModel from "../../models/tickets.models.js";

export class TicketsMongo {
  // Recibo los ticket del usuario
  getUserTickets = async (userEmail) => {
    try {
      const tickets = await ticketsModel.find({ purchaser: userEmail });
      if (!tickets) {
        return {
          code: 400,
          status: "Error",
          message: "No se han encontrado tickets",
        };
      }
      return {
        code: 200,
        status: "Success",
        message: tickets,
      };
    } catch (error) {
      console.error("Error al obtener los tickets del usuario", error);
      return {
        code: 500,
        status: "Error",
        message: "Error al obtener los tickets del usuario",
      };
    }
  };

  // Recibo el ticket en base a su ID
  getTicketByID = async (tid) => {
    const ticket = await ticketsModel.find({ _id: tid });
    if (!ticket) {
      return {
        code: 400,
        status: "Error",
        message: "No se ha encontrado un ticket con ese número de ID",
      };
    }
    return {
      code: 202,
      status: "Success",
      message: ticket,
    };
  };

  // Creamos un nuevo ticket
  createTicket = async (newTicket) => {
    try {
      const ticketCreated = await ticketsModel.create(newTicket);
      return {
        code: 202,
        status: "Success",
        message: `El ticket ha sido agregado con éxito`,
      };
    } catch (error) {
      return {
        code: 400,
        status: "Error",
        message: `${error}`,
      };
    }
  };
}
