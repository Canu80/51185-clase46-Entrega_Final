export class CustomError {
    static createError({ name = "Error", cause, message, errorCode }) {
      const error = new Error(message);
      error.name = name;
      error.code = errorCode;
      error.cause = cause; // Almacenar la causa del error como propiedad adicional
      console.log("error", error.cause);
      throw error;
    }
  }
  