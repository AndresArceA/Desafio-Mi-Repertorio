//importo express
const express = require('express');
const path = require('path');
const {errores} = require('./error/Errores.js');
const app = express();

//importo las funciones del archivo de consultas
const {agregacancion, listacancion, editacancion, borracancion} = require('./consultas/consultas.js');

//configuro el puerto de conexion y levanto el servidor
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor 💻 ThinkPad P51 corriendo en el puerto ${PORT} 🦾`);
});

app.use(express.json()); // Middleware para analizar el cuerpo de la solicitud como JSON

// dejo la carpeta /assets/img como publica
app.use(express.static(path.join(__dirname, 'assets/img')));

// Middleware para manejar errores 404 (páginas no encontradas) ---no lo usé porque cuando tengo error de alguna ruta dentro de las consultas de la tabla 
// me despliega la pagina 404
// app.use((req, res) => {
//     res.status(404).sendFile(path.join(__dirname, "/404.html"));
//   });


//ruta para cargar index.html
app.get("/", (req, res) => {
  try {
    res.sendFile(path.join(__dirname, "/index.html"), (err) => {
      if (err) {
        console.error("Error al enviar index.html:", err);
        res.sendFile(path.join(__dirname, "/404.html")); // Redirigir a la página 404 si hay un error al enviar el archivo
      }
    });
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

//ruta PUT /cancion, que actualiza los registros una cancion en la tabla

app.put("/cancion/:id", async (req, res) => {
    const id = req.params.id; // Obtener el ID de la canción de los parámetros de la URL
    const { titulo, artista, tono } = req.body;

    if (!id || !titulo || !artista || !tono) {
        // Valida que se estén pasando los parámetros para la consulta
        console.log("Debe proporcionar todos los valores correctamente para editar una Canción en el registro.");
        res.send("Debe proporcionar todos los valores correctamente para editar una Canción en el registro, Clickee boton Editar en la tabla de canciones.");
        return;
    }

    try {
        const cancionedit = await editacancion(id, titulo, artista, tono); // Llama a la función para editar la canción
        res.json(cancionedit);
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Error al editar la canción" });
    }
});

//ruta DELETE /cancion, que recibe el id de la canción y borra el registro

app.delete("/cancion", async (req, res) => {
    const id = req.query.id; // Obtener el ID de la canción de los parámetros de la URL
    if (!id) {
        // Valida que se estén pasando los parámetros para la consulta
        console.log("Debe proporcionar el Id de la canción a eliminar del registro.");
        res.send("Debe proporcionar el Id de la canción a eliminar del registro.");
        return;
    }

    try {
        const delcancion = await borracancion(id); // Llama a la función para eliminar la canción
        res.json(delcancion);
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Error al eliminar la canción" });
    }
});
