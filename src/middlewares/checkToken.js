const { sendJsonError } = require("../helpers");
const { verifyToken } = require("../helpers/verifyToken");

const checkToken = async (req, res, next) => {
  try {
    const token = req.header("Authorization") || req.params.token;
    if (!token) {
      /* 401: «No autorizado» o «Se requiere autorización». Esto es devuelto por el servidor cuando el recurso de destino carece de credenciales de autenticación válidas. */
      return sendJsonError("El token es requerido", res, 401);
    }

    const decoded = await verifyToken(token, process.env.SECRET_KEY_JWT);
    req.userToken = decoded;

  } catch (err) {
    /* 500: «Hubo un error en el servidor y la solicitud no pudo ser completada» */
    return sendJsonError("El token es invalido", res, 500);
  }
  next();
};

module.exports = { checkToken };
