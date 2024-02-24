const express = require("express");
require('dotenv').config();
const app = express();
var cors = require('cors');
const cookieParser = require('cookie-parser')
const ErrorMiddleware = require('./middlewares/Error.js')


// app.use(cors({
//   origin: process.env.FRONTEND_URL,
//   credentials: true,
//   methods: ["GET", "POST", "PATCH", "DELETE"],
// }));
app.use(cors());
app.use(express.json());
// app.use(express.urlencoded({
//   extended: true
// }))
const userRouter = require('./routers/userRouter.js');
const courseRouter = require('./routers/courseRouter.js')
const otherRouter = require('./routers/otherRouter.js')
const reviewRouter = require('./routers/reviewRouter.js')
const orderRouter = require('./routers/orderRouter.js')
app.use(cookieParser());
app.use("/api/v1", orderRouter);
app.use("/api/v1", userRouter);
app.use("/api/v1", courseRouter);
app.use("/api/v1", otherRouter);
app.use("/api/v1", reviewRouter);


app.get("/", function (req, res) {
  res.send(`<h1>Site is working fine. click <a href=${process.env.FRONTEND_URL}>here</a> </h1>`)
})
app.use(ErrorMiddleware);


module.exports = app;