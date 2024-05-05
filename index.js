//importo express
const express = require('express');
const path = require('path');
const {errores} = require('./error/Errores.js');
const app = express();

//importo las funciones de la base de datos
const { agregacancion } = require('./consultas/consultas.js');
const {listacancion} = require('./consultas/consultas.js');
// const {agregacancion} = require('./consultas/consultas.js');
// const {agregacancion} = require('./consultas/consultas.js');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor 💻 ThinkPad P51 corriendo en el puerto ${PORT} 🦾`);
});

app.use(express.json()); // Middleware para analizar el cuerpo de la solicitud como JSON

// dejo la carpeta /assets/img como publica
app.use(express.static(path.join(__dirname, 'assets/img')));

// Middleware para manejar errores 404 (páginas no encontradas)
// app.use((req, res) => {
//     res.status(404).sendFile(path.join(__dirname, "/404.html"));
//   });


//ruta para cargar index.html

app.get("/", (req, res) => {
  try {
    res.sendFile(path.join(__dirname, '/index.html'));
   } catch (error) {
    const EE = errores(error.code, error.status, error.message);
    console.log("Error", error);
    res.status(EE.status).json({
      message: EE.message,
    });
  }
});

//ruta POST /cancion, que inserta los registros de las caciones en la tabla
app.post("/cancion", async (req, res) => {
  const { titulo, artista, tono } = req.body;

  if (!titulo || !artista || !tono) {
    //valida que se estén pasando los parametros para la consulta
    console.log(
      "Debe proporcionar todos los valores correctamente para agregar una nueva Canción al registro."
    );
    res.send("Debe proporcionar todos los valores correctamente para agregar una nueva Canción al registro.");
    return;
  }
  try {
    const cancionadd = await agregacancion(titulo, artista, tono);
    res.json(cancionadd);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Error al agregar la canción",
    });
  }
});

//ruta GET /canciones que devuelve un JSON con los registros de la tabla canciones

app.get("/canciones", async (req, res) => {
    try {
        // listar todas las canciones
        const todas = await listacancion();
        
        // devuelve la lista de canciones como un JSON
        res.json(todas);
    } catch (error) {
        // manejo de errores
        console.error("Error al obtener la lista de canciones:", error);
        
        // Envía una respuesta de error al cliente con un código de estado 500 (Error interno del servidor)
        res.status(500).json({ error: 'Error al obtener la lista de canciones' });
    }
});

    

