const { literal } = require("sequelize");

/* FUNCIÓN -> DEVUELVE UN ARRAY CON UNA PROPIEDAD Y SU VALOR DENTRO DE UNA CONSULTA HECHA SOBRE UNA ASOCIACIÓN DE IMÁGENES (SEQUELIZE) */
const literalQueryUrlImage = (
  req,
  field,
  alias,
  pathRoute = `/products/image/`
) => {
  const urlImage = (req) => `${req.protocol}://${req.get("host")}${pathRoute}`;
  /* field = campo */
  return [literal(`CONCAT( '${urlImage(req)}',${field})`), alias];
};

/* ENVÍA UN RESPUESTA DE ERROR DENTRO DE UN CATCH */
/* EJEMPLO: .catch(sendJsonError(res)) */

/* 422: «Entidad no procesable«. La solicitud del cliente contiene errores semánticos, y el servidor no puede procesarla. */
// const sendJsonError = (
//   err,
//   res,
//   prop = "errors",
//   codeStatus = err.name === "SequelizeValidationError" ? 422 : 500
// ) => {
//   // EXPLICACIÓN DE LA FUNCION
//   /***
//    * Recorremos el array que recibimos por argumento,
//    * reduce recibe un callback y el primer parámetro es un acumulador,luego el error por cada iteración,
//    * y el segundo parámetro del reduce es un tipo de dato en nuestro caso un objecto.
//    *
//    * lógica del callback:
//    * retornamos en un objecto donde hacemos propagación de los datos del acumulador (que es un objeto) y luego se coloca el nuevo error con el formato esperado  nombreCampo : mensaje
//    */

//   const mapped = (errors = []) =>
//     errors.reduce(
//       (acum, error) => ({ ...acum, [error.path]: error?.message || "Error no contemplado" }),
//       {}
//     );

//   return res.status(codeStatus).json({
//     ok: false,
//     status: codeStatus,
//     [prop]: prop !== "errors" ? err : mapped(err.errors),
//   });
// };


