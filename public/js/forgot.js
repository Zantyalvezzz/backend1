document.getElementById("forgot-form")?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const data = Object.fromEntries(new FormData(e.target));

    try {
      const res = await fetch("/api/sessions/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      document.getElementById("message").textContent = result.message;
    } catch (err) {
      console.error(err);
    }
  });
