async function deleteUser(userId) {
  try {
    const response = await fetch(`/api/users/users/${userId}`, {
      method: "DELETE",
    });
    if (response.status === 200) {
      window.location.reload();
    } else {
      console.error("Error al eliminar el usuario.");
      alert("Error al eliminar el usuario.");
    }
  } catch (error) {
    console.error("Error en la solicitud AJAX: ", error);
    alert("Error al eliminar el usuario.");
  }
}
// Esta función se llama cuando se cambia el rol del usuario
async function changeUserRole(userId, form) {
    const newRole = form.querySelector(`select[name="newRole"]`).value;
    
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: "POST",
        body: JSON.stringify({ newRole }),
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      if (response.status === 200) {
        // Actualizar el rol en la vista
        const userRoleElement = document.querySelector(`#userRole-${userId}`);
        if (userRoleElement) {
          userRoleElement.textContent = newRole;
        }
      } else {
        console.error("Error al cambiar el rol del usuario.");
        alert("Error al cambiar el rol del usuario.");
      }
    } catch (error) {
      console.error("Error en la solicitud AJAX: ", error);
      alert("Error al cambiar el rol del usuario.");
    }
  }
  
  // Obtener todos los formularios de cambio de rol
  const changeRoleForms = document.querySelectorAll(".change-role-form");
  
  // Agregar un evento de escucha a cada formulario
  changeRoleForms.forEach((form) => {
    form.addEventListener("submit", (e) => {
      e.preventDefault(); // Evitar el envío del formulario
      const userId = form.getAttribute("data-user-id");
      changeUserRole(userId, form);
    });
  });


  
