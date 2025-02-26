const mongoose = require("mongoose");

const visitaSchema = new mongoose.Schema({
  count: { type: Number, default: 0 }, // Almacena el número de visitas
  timestamp: { type: Date, default: Date.now }, // Guarda la hora de la visita
  location: { type: String, default: "Desconocida" } // Guarda la ubicación (ciudad, país)
});

// Creamos el modelo 'Visita' basado en el esquema
const Visita = mongoose.model("Visita", visitaSchema);

module.exports = Visita;
