const messageEl = document.getElementById("cart-message");

document.querySelectorAll(".add-to-cart-form button").forEach((button) => {
  button.addEventListener("click", async (e) => {
    e.preventDefault();

    const form = button.closest("form");
    const quantity = form.querySelector('input[name="quantity"]').value || 1;

    try {
      const response = await fetch(form.action, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity }),
        credentials: "include",
      });

      const data = await response.json();

      if (data.status === "success") {
        messageEl.style.display = "block";
        clearTimeout(messageEl.timeout);
        messageEl.timeout = setTimeout(() => {
          messageEl.style.display = "none";
        }, 2000);
      } else {
        alert("No se pudo agregar al carrito: " + data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Error al agregar al carrito");
    }
  });
});
