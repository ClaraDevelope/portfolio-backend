require("dotenv").config();
const fs = require("fs");
const express = require("express");
const cors = require("cors");
const { programarEnvio, enviarReporteVisitas } = require("./mailer");

const app = express();
app.use(cors());
const PORT = process.env.PORT || 3000;
const VISITAS_FILE = "visitas.json";

app.use(express.json());

function getVisitas() {
    if (!fs.existsSync(VISITAS_FILE)) return { count: 0 };
    return JSON.parse(fs.readFileSync(VISITAS_FILE, "utf8"));
}


app.get("/contador", (req, res) => {
    let visitas = getVisitas();
    visitas.count++;
    fs.writeFileSync(VISITAS_FILE, JSON.stringify(visitas));
    res.json(visitas);
});

app.get("/contador/get", (req, res) => {
    res.json(getVisitas());
});
app.use("*", (req, res) => {
    return res.status(404).json({ message: "Ruta no encontrada" });
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
    // enviarReporteVisitas()
    programarEnvio()
});
