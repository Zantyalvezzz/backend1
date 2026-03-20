import cron from "node-cron";
import Cart from "../models/cart.model.js";

cron.schedule("0 * * * *", async () => {
  try {
    console.log("🧹 limpiando carritos invitados...");

    const result = await Cart.deleteMany({
      user: null,
      createdAt: {
        $lt: new Date(Date.now() - 24 * 60 * 60 * 1000),
      },
    });
  } catch (error) {
    console.error("Error en cron:", error);
  }
});
