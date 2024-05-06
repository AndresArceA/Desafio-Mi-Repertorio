const {pool} = require("../config/db.js");

// importo archivo para manejo de errores
const {errores} = require("../error/Errores.js");


//nombre de la tabla; se agrega tabla vacía y tabla no existente para manejar errores
const tabla = "canciones";
//const tabla = "can";//tabla vacía
//const tabla = "ninguna";



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
      values: [titulomin, artistamin, tonomin]
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
    return `La canción ${titulo} de ${artista} fue agregada correctamente al repertorio` // Devuelve los datos de la canción agregada
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


//--------------------------------------------------------------

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


//----------------------------------------------------

//editar canción

const editacancion = async (id, titulo, artista, tono) => {
  try {
    //verifico si la canción ya existe en la tabla
    const existeCancion = await pool.query({
      text: `SELECT * FROM ${tabla} WHERE id = $1`,
      values: [id],
    });
    //console.log(existeCancion);
    if (existeCancion.rowCount === 0) {
      return `La canción con el ID ${id} con ${titulo} de ${artista} no existe en el repertorio, seleccione una existente para editar.`;
      }else{
    
    //si existe, modifico la canción
    const result = await pool.query({
      text: `UPDATE ${tabla} SET titulo = $2, artista = $3, tono = $4 WHERE id = $1 RETURNING *;`,
      values: [id, titulo, artista, tono],
    });
    console.log(`Canción ${titulo} de ${artista} actualizada con éxito`);
    console.log("Canción Editada: ", result.rows[0]);
    console.log(result.rows[0]);
    return `La canción ${titulo} de ${artista} fue editada correctamente.`}; // Devuelve los datos de la canción editada
  } catch (error) {
    console.log("Error al editar la canción");
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

//---------------------------

//eliminar canción

const borracancion = async (id) => {
  try {
    //verifico si la canción ya existe en la tabla
    const existeCancion = await pool.query({
      text: `SELECT * FROM ${tabla} WHERE id = $1`,
      values: [id],
    });
    console.log(existeCancion);
    if (existeCancion.rowCount === 0) {
      return `La canción con el ID ${id} no existe en el repertorio, seleccione una existente para eliminar.`;
    }else{
    
    //si existe, elimino el registro
      const result = await pool.query({
      text: `DELETE FROM ${tabla} WHERE id = $1 RETURNING *;`,
      values: [id]
    });
    const cancion = result.rows[0];
    console.log(`Canción ${cancion.id} ${cancion.titulo} de ${cancion.artista} eliminada con éxito`);
    console.log("Canción Eliminada: ", cancion);
    console.log(result.rows[0]);
    return `La canción con Id ${cancion.id} ${cancion.titulo} de ${cancion.artista} fue eliminada correctamente.`}; // Devuelve los datos de la canción agregada
  } catch (error) {
    console.log("Error al eliminar la canción");
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

module.exports = {agregacancion, listacancion, editacancion, borracancion};

console.log('Archivo de consultas cargado con éxito 👌');



