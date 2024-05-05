const {pool} = require("../config/db.js");

// importo archivo para manejo de errores
const {errores} = require("../error/Errores.js");


const argumento = process.argv.slice(2);
const accion = argumento[0];
const titulo = argumento[1];
const artista = argumento[2];
const tono = argumento[3];

//nombre de la tabla; se agrega tabla vacía para manejar errores
const tabla = "canciones";
//const tabla = "can";//tabla vacía

//agregar estudiantes

// const nuevoEstudiante = async (rut, nombre, curso, nivel) => {
//     try {
//         const consulta = {
//             text: "insert into alumnos values ($1, $2, $3, $4)",
//             values: [rut, nombre, curso, nivel],
//         };
//         const res = await pool.query(consulta);
//         console.log(`El student fue agregado correctamente`);
//         } catch (error) {
//             console.log(error.code, error.message);
//         }
//     }

//agregar canción

const agregacancion = async (titulo, artista, tono) => {
  try {
    //Convierto titulos y nombres de artistas en minusculas
    const titulomin = titulo.trim().toLowerCase();
    const artistamin = artista.trim().toLowerCase();
    const tonomin = tono.trim().toLowerCase();

    //verifico si la canción ya existe en la tabla
    const existeCancion = await pool.query({
      text: `SELECT * FROM ${tabla} WHERE LOWER(TRIM(titulo)) = LOWER(TRIM($1)) AND LOWER(TRIM(artista)) = LOWER(TRIM($2)) AND LOWER(TRIM(tono)) = LOWER(TRIM($3))`,
      values: [titulomin, artistamin, tonomin],
    });
    //console.log(existeCancion);
    if (existeCancion.rowCount > 0) {
      return `La canción ${titulo} de ${artista} ya existe en el repertorio`;
      //throw new Error(`La canción ${titulo} ya existe en el repertorio`);
    }
    //si no existe, agrego la canción
    const result = await pool.query({
      text: `INSERT INTO ${tabla} (titulo, artista,tono) VALUES ($1, $2, $3) RETURNING *`,
      values: [titulo, artista, tono],
    });
    console.log(`Canción ${titulo} de ${artista} agregada con éxito`);
    console.log("Canción Agregada: ", result.rows[0]);
    console.log(result.rows[0]);
    return `La canción ${titulo} de ${artista} fué agregada correctamente al repertorio` // Devuelve los datos de la canción agregada
  } catch (error) {
    console.log("Error al agregar la canción");
    const EE = errores(error.code, error.status, error.message);
    console.log(
      "Status ",
      EE.status,
      " |Error Cod. ",
      EE.code,
      "|",
      EE.message
    );
    return EE;
  }
};

//module.exports = { agregacancion };

//lista todas las canciones 

const listacancion = async () => {
  try {
    const res = await pool.query({
      // consulta para listar todas las canciones
           text: `SELECT * FROM ${tabla}`,
    });
    // bloque if para validar que la tabla está vacía
    if (res.rowCount == 0) {
      console.log(
        `No existen Canciones en el repertorio; favor agregar y repetir la consulta.`
      );
      return `No existen Canciones en el repertorio; favor agregar y repetir la consulta.`;
    } else {
      console.log(`Canciones incluídas en el repertotio`, res.rows);
      // Devuelve los resultados de la consulta 
      return res.rows;
    }
  } catch (error) {
    const EE = errores(error.code, error.status, error.message);
    console.log(
      "Status ",
      EE.status,
      " |Error Cod. ",
      EE.code,
      "|",
      EE.message
    );
    return EE;
  }
};

module.exports = {agregacancion, listacancion};

//consultar por rut
const consultaAlumno = async (rut) => {
  try {
    const consulta = {
      text: "select * from alumnos where rut = $1",
      values: [rut],
    };
    const res = await pool.query(consulta);
    console.log(`El estudiante con el rut ${rut} es: ${JSON.stringify(res.rows)}`);
  } catch (error) {
    console.log(error.code, error.message);
  }
};

//export {consultaAlumno}




// Función para actualizar un alumno por su Rut
const actualizarAlumno = async (rut, nombre, curso, nivel) => {
  console.log(rut, nombre, curso , nivel);
  if (!rut || !nombre || !curso || !nivel) {
    //valida que se estén pasando los parametros para la consulta
    console.log(
      "Debe proporcionar todos los valores correctamente para actualizar la informacion de un Alumno, Rut, Nombre, Curso y Nivel."
    );
    return "Debe proporcionar todos los valores correctamente para actualizar la informacion de un Alumno, Rut, Nombre, Curso y Nivel.";
  }
    //return res("Debe proporcionar todos los valores correctamente para actualizar la informacion de un Alumno, Rut, Nombre, Curso y Nivel.");}
  try {
    const res = await pool.query({
      text: `UPDATE ${tabla} SET nombre=$2, curso=$3, nivel=$4 WHERE rut=$1 RETURNING *`,
      values: [rut, nombre, curso, nivel],
    });

    if (res.rowCount > 0) {
      console.log(`Alumno con rut ${rut} actualizado con éxito`);
      console.log("Alumno Actualizado: ", res.rows[0]);
    } else {
      console.log(
        `No se encontró ningún alumno con el rut ${rut}, revise los datos y reintente`
      );
      return `No se encontró ningún alumno con el rut ${rut}, revise los datos y reintente`;
    }
  } catch (error) {
    console.log("Error al actualizar el alumno");
    const EE = errores(error.code, error.status, error.message);
    console.log(
      "Status ",
      EE.status,
      " |Error Cod. ",
      EE.code,
      "|",
      EE.message
    );
    return EE;
  }
};

//export {actualizarAlumno};


// Función para eliminar un alumno por su rut
const eliminarAlumno = async (rut) => {
  try {
    if (!rut) {
    console.log("Debe proporcionar un valor para buscar el 'rut' del alumno que desea eliminar.");
    return "Debe proporcionar un valor para buscar el 'rut' del alumno que desea eliminar.";
  }
  // Verifico si el Rut es un valor numérico válido antes de realizar la consulta,
  //para valor string opera el manejo de errores capturando el codigo de error.
  if (isNaN(rut)) {
    console.log("El Rut debe ser un valor numérico válido.");
    return;
  }
    const existeRut = await pool.query({
      // Consulto si el Rut existe en la tabla
      text: `SELECT * FROM ${tabla} WHERE rut = $1`,
      values: [rut],
    });
    
    if (
      // Verifico si el Rut existe en la tabla
      existeRut.rowCount === 0
    ) {
      console.log(
        `El Rut ${rut} no existe en la base de datos. Revise el Rut e intentelo nuevamente`
      );
    } else {
      // Si el Rut existe, realizo la operación
      const res = await pool.query({
        text: `DELETE FROM ${tabla} WHERE rut=$1 RETURNING *`,
        values: [rut],
      });
      console.log(`${JSON.stringify(res.rows)} Alumno con rut ${rut} eliminado con éxito`);
      console.log("Alumno Eliminado: ", res.rows[0]);
    }
  } catch (error) {
    // Manejo de los errores
    const EE = errores(error.code, error.status, error.message);
    console.log(
      "Status ",
      EE.status,
      " | Error Cod. ",
      EE.code,
      " | ",
      EE.message
    );
  }
};

//export {eliminarAlumno};

// Función para consultar un alumno por su rut
const consultAlumno = async (rut) => {
  try {
    if (!rut) {
    console.log("Debe proporcionar un valor para buscar el 'rut' del alumno que desea eliminar.");
    return;
  }
  // Verifico si el Rut es un valor numérico válido antes de realizar la consulta,
  //para valor string opera el manejo de errores capturando el codigo de error.
  if (isNaN(rut)) {
    console.log("El Rut debe ser un valor numérico válido.");
    return;
  }
    const existeRut = await pool.query({
      // Consulto si el Rut existe en la tabla
      text: `SELECT * FROM ${tabla} WHERE rut = $1`,
      values: [rut],
    });
    
    if (
      // Verifico si el Rut existe en la tabla
      existeRut.rowCount === 0
    ) {
      console.log(
        `El Rut ${rut} no existe en la base de datos. Revise el Rut e intentelo nuevamente`
      );
    } else {
      // Si el Rut existe, realizo la operación
      const consulta = {
        text: "select * from alumnos where rut = $1",
        values: [rut],
      };
      console.log(`${JSON.stringify(consulta.rows)} Alumno con rut ${rut} consultado con éxito`);
      console.log("Alumno Consultado ", consulta.rows[0]);
    }
  } catch (error) {
    // Manejo de los errores
    const EE = errores(error.code, error.status, error.message);
    console.log(
      "Status ",
      EE.status,
      " | Error Cod. ",
      EE.code,
      " | ",
      EE.message
    );
  }
};

//export {consultAlumno};

// //eliminar registro de estudiante {eliminar}
// const eliminarEstudiante = async (rut) => {
//   try {
//     const consulta = {
//       text: "delete from alumnos where rut = $1",
//       values: [rut],
//     };
//     const res = await pool.query(consulta);
//     console.log(`${JSON.stringify(res.rows)} Estudiante con rut ${rut} eliminado correctamente!`);
//   } catch (error) {
//     console.log(error.code, error.message);
// }
// };

console.log('Archivo de consultas cargado con éxito 👌');



// //nombrar acciones/fx's
// if (accion === "agregar") {
//   nuevoEstudiante(nombre, rut, curso, nivel);
// } else if (accion === "verRut") {
//   rut = argumento[1];
//   rutEstudientes(rut);
// } else if (accion === "verTodos") {
//   verEstudiantes();
// } else if (accion === "actualizar") {
//   actualizarEstudiante(nombre, rut, curso, nivel);
// } else if (accion === "eliminar") {
//   rut = argumento[1];
//   eliminarEstudiante(rut);
// } else {
//   console.log("Accion no valida!🔥");
// }