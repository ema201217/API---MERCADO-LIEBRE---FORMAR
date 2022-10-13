const { literal } = require("sequelize");

/* FUNCIÓN -> DEVUELVE UN ARRAY CON UNA PROPIEDAD Y SU VALOR DENTRO DE UNA CONSULTA HECHA SOBRE UNA ASOCIACIÓN DE IMÁGENES (SEQUELIZE) */
const literalQueryUrlImage = (
  req,
  field,
  alias = field,
  pathRoute = req.baseUrl
) => {
  const urlImage = (req) =>
    `${req.protocol}://${req.get("host")}${pathRoute[0] === '/' ? pathRoute : `/${pathRoute}`}/image/`;
  /* field = campo */
  return [literal(`CONCAT( '${urlImage(req)}',${field})`), alias];
};

module.exports = {
  literalQueryUrlImage,
};
