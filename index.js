const express = require("express");
require('dotenv').config();
const app = express();
const app2 = express();
var cors = require('cors');
const cookieParser = require('cookie-parser')
const port = process.env.PORT;
// const multer = require('multer')

const ErrorMiddleware = require('./middlewares/Error.js')


// app.listen(port, () => {
//   console.log(`Example app listening on port ${port}`);
// });
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
  methods: ["GET", "POST", "PATCH", "DELETE"],
}));
app2.use(cors({
  origin: process.env.FRONTEND_URL2,
  credentials: true,
  methods: ["GET", "POST", "PATCH", "DELETE"],
}));
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}))
app2.use(express.json());
app2.use(express.urlencoded({
  extended: true
}))
const userRouter = require('./routers/userRouter.js');
const courseRouter = require('./routers/courseRouter.js')
const otherRouter = require('./routers/otherRouter.js')

// const reviewRouter = require('./routers/reviewRouter.js')
app.use(cookieParser());
app.use("/api/v1", userRouter);
app.use("/api/v1", courseRouter);
app.use("/api/v1", otherRouter);

app2.use(cookieParser());
app2.use("/api/v1", userRouter);
app2.use("/api/v1", courseRouter);
app2.use("/api/v1", otherRouter);
// app.use("/review", reviewRouter)

app.get("/", function (req, res) {
  res.send(`<h1>Site is working fine. click <a href=${process.env.FRONTEND_URL2}>here</a> </h1>`)
  res.send(`<h1>Site is working fine. click <a href=${process.env.FRONTEND_URL}>here</a> </h1>`)
})
app.use(ErrorMiddleware);


module.exports = {app,app2};