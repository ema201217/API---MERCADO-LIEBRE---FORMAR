const path = require('path')



module.exports = {
  // API -> GET IMAGE IN VIEW
  image: (req, res) => {
    return res.sendFile(
      path.join(__dirname, `../../public/images/avatars/`, req.params.img)
    );
  },

  update: (req, res) => {

  },
  
  logout: (req, res) => {

  },

  remove: (req, res) => {

  },
};
