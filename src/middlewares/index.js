const { checkPermission } = require("./checkPermission");
const { checkToken } = require("./checkToken");
const { uploadImageAvatar, uploadImageProduct } = require("./uploadFiles");

module.exports = {
checkToken,
checkPermission,
uploadImageProduct,
uploadImageAvatar
}