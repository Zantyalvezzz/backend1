import mongoose from "mongoose";

export default class MongoSingleton {
  static #instance;

  constructor() {
    mongoose
      .connect(process.env.MONGO_URI)
      .then(() => console.log("Conectado a MongoDB"))
      .catch((err) => console.error("Error conectandose con MongoDB:", err));
  }

  static getInstance() {
    if (!MongoSingleton.#instance) {
      MongoSingleton.#instance = new MongoSingleton();
    }

    return MongoSingleton.#instance;
  }
}
