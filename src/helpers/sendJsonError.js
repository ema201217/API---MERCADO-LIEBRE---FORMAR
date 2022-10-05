const mapped = (errors = []) =>
  errors.reduce(
    (acum, error) => ({
      ...acum,
      [error.path]: error.message,
    }),
    {}
  );

const sendJsonError = (
  err,
  res,
  codeStatus = /sequelize/gi.test(err.name) ? 422 : 500
) => {
  let prop = "error";
  let responseErr = "";

  // Funcion que mapea un array de objetos
  // example -->  [{ email : "Campo requerido" },{password : "Credenciales invalidas"}]

    if (err.errors && Array.isArray(err.errors)) {
      prop += "s";
      responseErr = ""; // valor por defecto si hay un error pero no sabemos cual es
      
      // si en el primer objecto obtenido existe la propiedad path y message significa que es un error enviado por sequelize
      if (err.name && err.name === "SequelizeValidationError") {  
        responseErr = mapped(err.errors); // mapeamos el array de errores
      }

      // si enviamos por con throw desde el Try colocamos el mensaje colocado con la instancia "new Error"
    } else if (err.message) {
      responseErr = err.message; 
    } else {
      responseErr = err
    }

  return res.status(codeStatus).json({
    ok: false,
    status: codeStatus,
    [prop]: responseErr,
  });
};

module.exports = {
  sendJsonError,
};
