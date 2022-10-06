/* REQUIRES */
require("dotenv").config();
const express = require("express");
const logger = require("morgan");
const { sendJsonError } = require("./helpers");
const app = express();

/* Middleware */
app.use(express.urlencoded({ extended: false }));
app.use(logger("dev"));
app.use(express.json());

/* Routers */
// const mainRouter = require("./routes/main"); 
const productsRouter = require("./routes/products"); 
const authRouter = require("./routes/auth"); 
const usersRouter = require("./routes/users");

/* Routes */
// app.use("/", (req,res) => res.('/products')/* mainRouter */); 
app.use("/products", productsRouter);
app.use("/auth", authRouter);
app.use("/users", usersRouter);


/* Errors not found */
app.use("*",(req, res) => {
  sendJsonError("Not found",res,404)
});

/* ERRORS SERVER */
app.use((err, req, res, next) => {
  sendJsonError(err,res,500)
});

module.exports = app;
