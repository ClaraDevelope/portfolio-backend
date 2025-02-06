const fs = require("fs");
const path = require("path");

const VISITAS_FILE = path.join(__dirname, "visitas.json");

const getVisitas = () => {
  if (!fs.existsSync(VISITAS_FILE)) {
    return { count: 0 };
  }
  return JSON.parse(fs.readFileSync(VISITAS_FILE, "utf8"));
};
const counter = (req, res, next) => {
  try {

    let visitas = getVisitas();
    
    visitas.count++;

    fs.writeFileSync(VISITAS_FILE, JSON.stringify(visitas));

    res.json(visitas);
  } catch (error) {
    next(error);
  }
};
const getCounter = (req, res, next) => {
  try {
    const visitas = getVisitas();
    res.json(visitas);
  } catch (error) {
    next(error);
  }
};

// Exportamos las funciones para poder usarlas en otros archivos
module.exports = {
  counter,
  getCounter
};
