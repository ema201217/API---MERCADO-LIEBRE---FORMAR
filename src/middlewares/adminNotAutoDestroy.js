const { ROL_ADMIN, ID_ADMIN } = require("../constants");
const { sendJsonError } = require("../helpers");

/* prevenir auto eliminación del administrador */
const preventAdminSelfRemoval = (req, res, next) => {
  const idParams = +req.params.id;
  const { id } = req.userToken;

  if ((idParams && idParams == ID_ADMIN) || (!idParams && id == ID_ADMIN)) {
    return sendJsonError("Este usuario no puede auto eliminarse", res);
  }
  next();
};

module.exports = { preventAdminSelfRemoval };
