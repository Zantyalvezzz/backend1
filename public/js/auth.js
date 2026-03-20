document.addEventListener("DOMContentLoaded", () => {
  const messageEl = document.getElementById("message");

  function showMessage(text, isError = false) {
    messageEl.textContent = text;
    messageEl.style.color = isError ? "red" : "green";
  }

  document
    .getElementById("login-form")
    ?.addEventListener("submit", async (e) => {
      e.preventDefault();

      const form = e.target;
      const data = Object.fromEntries(new FormData(form));

      try {
        const res = await fetch("/api/sessions/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
          credentials: "include",
        });

        const result = await res.json();

        if (result.status === "success") {
          showMessage("Login correcto");
          setTimeout(() => {
            window.location.href = "/products";
          }, 1000);
        } else {
          showMessage(result.message, true);
        }
      } catch (err) {
        console.error(err);
        showMessage("Error en login", true);
      }
    });

  document
    .getElementById("register-form")
    ?.addEventListener("submit", async (e) => {
      e.preventDefault();

      const form = e.target;
      const data = Object.fromEntries(new FormData(form));

      try {
        const res = await fetch("/api/sessions/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });

        const result = await res.json();

        if (result.status === "success") {
          showMessage("Usuario creado correctamente");
        } else {
          showMessage(result.message, true);
        }
      } catch (err) {
        console.error(err);
        showMessage("Error en registro", true);
      }
    });
});

document.getElementById("logout-btn")?.addEventListener("click", async () => {
  try {
    const res = await fetch("/api/sessions/logout", {
      method: "POST",
      credentials: "include",
    });

    const data = await res.json();

    if (data.status === "success") {
      window.location.href = "/login";
    } else {
      alert("Error al cerrar sesión");
    }
  } catch (err) {
    console.error(err);
  }
});
