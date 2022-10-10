const { ROL_ADMIN } = require("../constants");
const { sendJsonError } = require("../helpers");

const checkPermission = (req, res, next) => {
  try {
    const { rolId, id } = req.userToken;
    const { id: idUserParams = null } = req.params;

    if (idUserParams) {
      if (isNaN(idUserParams)) {
        return sendJsonError("Parámetro invalido", res);
      } else if (+id !== +idUserParams) {
        return sendJsonError("No tiene permisos necesarios", res);
      } else {
        return next();
      }
    }

    if (rolId !== ROL_ADMIN || id !== idUserParams) {
      return sendJsonError("No tiene permisos", res);
    }else{
      return next();
    }

    /* 403: «El acceso a ese recurso está prohibido». Este código se devuelve cuando un usuario intenta acceder a algo a que no tiene permiso para ver. */
  } catch (err) {
    sendJsonError(err, res);
  }
};

module.exports = { checkPermission };
