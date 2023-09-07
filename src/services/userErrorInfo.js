export const generateUserError = (user) =>{
    return `
    Alguno de los campos para crear el usuario no es valido:
    Lista de campos requeridos:
    Nombre: Debe ser un campo string, pero recibio "${user.first_name}".
    Apellido: Debe ser un campo string, pero recibio "${user.last_name}".
    Edad: Debe ser un campo number, pero recibio "${user.age}".
    Dirección de email: Debe ser un campo string, pero recibio "${user.email}".
    `
}
