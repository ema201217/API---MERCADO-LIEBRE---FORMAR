const {sign} = require('jsonwebtoken')

const createToken = (data = {}) =>
  new Promise((resolve, reject) => {

      sign(data , process.env.SECRET_KEY_JWT, { expiresIn: "4h" }, (err, token) => {
          if (err) {
          reject(err);
          }else{
          resolve(token);
          }
        }
      );
  });

module.exports = { createToken };
