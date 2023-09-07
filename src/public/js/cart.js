$(document).ready(function () {
    // Evento para el botón de suma
    $(".btn-plus").on("click", function () {
      const pid = $(this).data("pid");
      const quantityInput = $(`input[data-pid="${pid}"]`);
      let quantity = parseInt(quantityInput.val());
      quantity++;
      quantityInput.val(quantity);
      updateProductTotal(pid);
      updateCartTotal();
    });
  
    // Evento para el botón de resta
    $(".btn-minus").on("click", function () {
      const pid = $(this).data("pid");
      const quantityInput = $(`input[data-pid="${pid}"]`);
      let quantity = parseInt(quantityInput.val());
      if (quantity > 1) {
        quantity--;
        quantityInput.val(quantity);
        updateProductTotal(pid);
        updateCartTotal();
      }
    });
  
    // Función para actualizar el total del producto
    function updateProductTotal(pid) {
      const quantityInput = $(`input[data-pid="${pid}"]`);
      const totalTd = $(`.total[data-pid="${pid}"]`);
      const price = parseFloat(quantityInput.data("price"));
      const quantity = parseInt(quantityInput.val());
      const total = price * quantity;
      totalTd.text(`$${total.toFixed(2)}`);
    }
  
    // Función para actualizar el total del carrito
    function updateCartTotal() {
      let cartTotal = 0;
      $(".total").each(function () {
        cartTotal += parseFloat($(this).text().replace("$", ""));
      });
      $("#cartTotal").text(`$${cartTotal.toFixed(2)}`);
    }
  
    // Evento para el botón de pago
    $("#checkoutButton").on("click", function () {
      // Aquí puedes implementar la lógica para procesar el pago y generar el ticket.
      // Puedes abrir un modal para mostrar el ticket.
      // Por ejemplo: $('#ticketModal').modal('show');
    });
  });
  