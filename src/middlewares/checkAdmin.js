const { ROL_ADMIN } = require("../constants/constants");
const { sendJsonError } = require("../helpers");

const checkPermission = (req, res, next) => {

  const {rolId} = req.userToken;

  if(rolId !== ROL_ADMIN){

    /* 403: «El acceso a ese recurso está prohibido». Este código se devuelve cuando un usuario intenta acceder a algo a que no tiene permiso para ver. */

    sendJsonError("No tiene permisos para este proceso",res,'error',403)
  }
  
 
  next();
  
};

module.exports = { checkPermission };
