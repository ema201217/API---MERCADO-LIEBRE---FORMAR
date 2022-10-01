/* REQUIRES */
require("dotenv").config();
const express = require("express");
const logger = require("morgan");
const path = require("path");

const app = express();

/* Middleware */
app.use(express.static(path.join(__dirname, "../public")));
app.use(express.urlencoded({ extended: false }));
app.use(logger("dev"));
app.use(express.json());

app.set('views', path.join(__dirname, 'views'));

/* Routers */
/* const mainRouter = require("./routes/main"); // Rutas main */
const productsRouter = require("./routes/products"); // Rutas /products
/* const usersRouter = require("./routes/users"); // Rutas /users */

/* Routes */
/* app.use("/", mainRouter);
app.use("/users", usersRouter); */
app.use("/products", productsRouter);

/* Errors not found */
app.use("*",(req, res) => {
  res.status(404).json({
    ok:false,
    status:404,
    msg:'Not found'
  })
});


app.use((err, req, res, next) => {

  res.locals.error = req.app.get("env") === "development" ? err : {};

  res.status(err.status || 500).json({
    ok: false,
    status: err.status || 500,
    msg: err.message
  });
});

module.exports = app;
