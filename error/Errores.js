function errores(code, status, message) {
switch (code) {
    case '28000':
        status = 400;
        message = "Usuario no existe, revise sus datos de acceso.";
        break;
    case '23502':
        status = 400;
        message = "Debe ingresar todos los campos para Agregar o Editar usuarios, Rut, Nombre, Curso y Nivel.";
        break;
    case '22P02':
        status = 400;
        message = "El Rut, ingresado no tiene formato valido, ingrese el Rut, sin puntos, guiones ni digito verificador; favor intente de nuevo.";
        break;
    case '23505':
        status= 400;
        message = "Ya existe el Rut ingresado, favor ingrese un Rut nuevo.";
        break;
    case '28P01':
        message = "Autenticación de contraseña falló o no existe el usuario: " + pool.options.user;
        break;
    case '23505':
        status = 400;
        message = "Ya existe el ID a ingresar";
        break;
    case '28P01':
        status = 400;
        message = "autentificacion password falló o no existe usuario: ";
        break;
    case '42P01':
        status = 400;
        message = "No existe la tabla consultada ";
        break;    
    case '3D000':
        status = 400;
        message = "No existe la BD solicitada, revise los datos de conexión.";
        break;
    case 'ENOTFOUND':
        status = 500;
        message = "El nombre del Host está incorrecto, corrija los datos de conexión.";
        break;
    case 'ENOENT':
        status = 500;
        message = "No se encuentra el archivo solicitado, favor revisar las rutas.";
        break;
    case 'ECONNREFUSED':
        status = 500;
        message = "Error en el puerto de conexion a BD";
        break;
    default:
        status = 500;
        message = "Error generico del Servidor";
        break;
}

  return {code, status, message}
}

module.exports = {errores};