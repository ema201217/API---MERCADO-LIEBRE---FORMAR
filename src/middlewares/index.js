const { preventAdminSelfRemoval } = require("./adminNotAutoDestroy");
const { checkPermission } = require("./checkPermission");
const { checkToken } = require("./checkToken");
const { uploadImageAvatar, uploadImageProduct } = require("./uploadFiles");

module.exports = {
  checkToken,
  checkPermission,
  preventAdminSelfRemoval,
  uploadImageProduct,
  uploadImageAvatar
}