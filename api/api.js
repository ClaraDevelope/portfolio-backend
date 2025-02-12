const Visita = require("../models/visita"); 


const incrementVisitas = async () => {
  try {
    const visita = await Visita.findOneAndUpdate(
      {},  // Sin filtro para actualizar el primer documento
      { $inc: { count: 1 } },  // Incrementa el campo count
      { new: true, upsert: true }  // Asegura que se cree si no existe
    );
    return visita; // Devuelve el documento con el contador actualizado
  } catch (error) {
    console.error("Error al incrementar el contador:", error);
    throw new Error("Error al incrementar el contador");
  }
};

const counter = async (req, res, next) => {
  try {
    const visita = await incrementVisitas();  // Solo incrementa y devuelve el resultado
    console.log("Contador actualizado correctamente.");
    res.status(200).json(visita);  // Devuelve el documento con el contador actualizado
  } catch (error) {
    console.error("Error al incrementar el contador:", error);
    res.status(500).json({ error: "Error al incrementar el contador" });
  }
};


const getCounter = async (req, res, next) => {
  try {
    const visita = await Visita.findOne({});  // Busca el primer documento
    res.status(200).json(visita);  // Devuelve solo el valor de visitas sin modificarlo
  } catch (error) {
    console.error("Error al obtener el contador:", error);
    res.status(500).json({ error: "Error al obtener el contador" });
  }
};


module.exports = {
  counter,
  getCounter
};

