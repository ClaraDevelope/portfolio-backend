// models/Visita.js

const mongoose = require("mongoose");

const visitaSchema = new mongoose.Schema({
  count: { type: Number, default: 0 }, // Almacenará el número de visitas
});

// Creamos el modelo 'Visita' basado en el esquema
const Visita = mongoose.model("Visita", visitaSchema);

module.exports = Visita;
