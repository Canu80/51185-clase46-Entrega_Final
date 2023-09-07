document.addEventListener("DOMContentLoaded", () => {
  const purchaseButton = document.getElementById("purchaseButton");
  const ticketCodeElement = document.getElementById("ticketCode");
  const ticketDateElement = document.getElementById("ticketDate");
  const ticketAmountElement = document.getElementById("ticketAmount");
  const ticketPurchaserElement = document.getElementById("ticketPurchaser");

  purchaseButton.addEventListener("click", async () => {
    const cid = purchaseButton.dataset.cartId;
    try {
      const response = await fetch(`/api/carts/${cid}/purchase`, {
        method: "POST",
      });
      if (response.ok) {
        const ticketData = await response.json();
        console.log(ticketData);
        ticketCodeElement.textContent = ticketData.code;
        ticketDateElement.textContent = ticketData.purchase_datetime;
        ticketAmountElement.textContent = ticketData.amount;
        ticketPurchaserElement.textContent = ticketData.purchaser;
        const popup = document.getElementById("purchasePopup");
        popup.style.display = "block";
        const closePopupButton = document.getElementById("closePopup");
        closePopupButton.addEventListener("click", () => {
          popup.style.display = "none";
          location.reload();
        });
      } else {
        console.error("Error al realizar la compra");
      }
    } catch (error) {
      console.error("Error en la solicitud de compra", error);
    }
  });
});
document.addEventListener("DOMContentLoaded", function () {
  function updateSubtotals() {
    const quantityElements = document.querySelectorAll(".quantity");
    const priceElements = document.querySelectorAll(".price");
    const subtotalElements = document.querySelectorAll(".subtotal-value");
    let total = 0;

    for (let i = 0; i < quantityElements.length; i++) {
      const quantity = parseInt(quantityElements[i].value);
      const price = parseFloat(priceElements[i].textContent.replace("$", ""));
      const subtotal = quantity * price;
      subtotalElements[i].textContent = subtotal.toFixed(0);
      total += subtotal;
    }
    document.getElementById("totalValue").textContent = total.toFixed(0);
  }
  updateSubtotals();
  // Agregar un evento para actualizar los subtotales cuando cambie la cantidad
  const quantityInputs = document.querySelectorAll(".quantity");
  quantityInputs.forEach(function (input) {
    input.addEventListener("input", function () {
      updateSubtotals();
    });
  });
  
  // Agregar un evento de cambio a cada campo de cantidad
  quantityInputs.forEach(function (input) {
    input.addEventListener("change", function () {
      // Obtener el valor actual del campo
      let newValue = parseInt(input.value);
      // Verificar si el valor es menor que 1
      if (newValue < 1) {
        // Si es menor que 1, establecerlo en 1
        newValue = 1;
        input.value = newValue;
      }
      updateSubtotals(input);
    });
  });
});
  