/* REQUIRES */
require("dotenv").config();
const express = require("express");
const logger = require("morgan");

const app = express();

/* Middleware */
app.use(express.urlencoded({ extended: false }));
app.use(logger("dev"));
app.use(express.json());

/* Routers */
const mainRouter = require("./routes/main"); 
const productsRouter = require("./routes/products"); 
const authRouter = require("./routes/auth"); 
const usersRouter = require("./routes/users");

/* Routes */
app.use("/", mainRouter); 
app.use("/products", productsRouter);
app.use("/auth", authRouter);
app.use("/users", usersRouter);


/* Errors not found */
app.use("*",(req, res) => {
  res.status(404).json({
    ok:false,
    status:404,
    msg:'Not found'
  })
});


app.use((err, req, res, next) => {

  res.status(err.status || 500).json({
    ok: false,
    status: err.status || 500,
    msg: err.message
  });
});

module.exports = app;
