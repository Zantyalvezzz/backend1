document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("close-overlay")?.addEventListener("click", () => {
    document.getElementById("purchase-overlay").style.display = "none";
  });

  async function updateQuantity(pid, newQty) {
    try {
      if (newQty < 1) return;

      const response = await fetch(`/api/carts/products/${pid}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity: newQty }),
        credentials: "include",
      });

      const data = await response.json();

      if (data.status === "success") {
        const itemEl = document.querySelector(`.cart-item[data-pid="${pid}"]`);
        if (!itemEl) return;

        itemEl.querySelector(".quantity").textContent = newQty;
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error(err);
    }
  }

  document.querySelectorAll(".increase-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const item = btn.closest(".cart-item");
      const pid = item.dataset.pid;
      const current = parseInt(item.querySelector(".quantity").textContent);
      updateQuantity(pid, current + 1);
    });
  });

  document.querySelectorAll(".decrease-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const item = btn.closest(".cart-item");
      const pid = item.dataset.pid;
      const current = parseInt(item.querySelector(".quantity").textContent);
      updateQuantity(pid, current - 1);
    });
  });

  document
    .getElementById("clear-cart-btn")
    ?.addEventListener("click", async () => {
      if (!confirm("¿Vaciar carrito?")) return;

      try {
        const res = await fetch("/api/carts", {
          method: "DELETE",
          credentials: "include",
        });
        const data = await res.json();

        if (data.status === "success") {
          document.querySelectorAll(".cart-item").forEach((el) => el.remove());
        } else {
          alert(data.message);
        }
      } catch (err) {
        console.error(err);
      }
    });

  document
    .getElementById("purchase-btn")
    ?.addEventListener("click", async () => {
      try {
        const res = await fetch("/api/carts/purchase", {
          method: "POST",
          credentials: "include",
        });
        const data = await res.json();

        if (data.status === "success") {
          const ticket = data.payload.ticket;
          const notPurchased = data.payload.productsNotPurchased;

          let html = `
          <p><strong>Código:</strong> ${ticket.code}</p>
          <p><strong>Total:</strong> $${ticket.amount}</p>
        `;

          if (notPurchased.length > 0) {
            html += `<p>Productos sin stock:</p><ul>`;
            notPurchased.forEach((p) => {
              html += `<li>${p.product?.title || "Producto"} - Cantidad: ${p.quantity}</li>`;
            });
            html += `</ul>`;
          }

          document.getElementById("ticket-info").innerHTML = html;
          document.getElementById("purchase-overlay").style.display = "flex";

          document.querySelectorAll(".cart-item").forEach((el) => el.remove());
        } else {
          alert(data.message);
        }
      } catch (err) {
        console.error(err);
      }
    });
});
