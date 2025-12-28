document.addEventListener("DOMContentLoaded", () => {
  const forms = document.querySelectorAll(".add-to-cart-form");

  forms.forEach((form) => {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const action = form.getAttribute("action");
      const formData = new FormData(form);
      const quantity = formData.get("quantity");

      try {
        const res = await fetch(action, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ quantity }),
        });

        const data = await res.json();
        if (data.status === "success") {
          alert("Producto agregado al carrito");
        } else {
          alert("Error al agregar al carrito");
        }
      } catch (error) {
        alert("Error al conectar con el servidor");
        console.error(error);
      }
    });
  });
});
