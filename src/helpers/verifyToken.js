const { verify } = require("jsonwebtoken");

const verifyToken = (token) =>
  new Promise((resolve, reject) => {
    verify(token, process.env.SECRET_KEY_JWT, (err, data) => {
      if (err) {
        reject(err);
      }
      resolve(data);
    });
  });

module.exports = { verifyToken };
