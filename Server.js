require('dotenv').config;
require('./db/db.js')
const later = require('later')
const express = require("express");
const statsModel = require('./models/statsModel.js');
const app = require('./index.js');

const port = process.env.PORT
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});

const schedule = later.parse.cron("0 0 0 1 * *");
const timer = later.setInterval(async function () {
    try {
        await statsModel.create();
    } catch (error) {
        console.log(error);
    }
}, schedule);

// const temp = async function temp() {
//     await statsModel.create({});
// }
// temp()
// To stop the timer after a certain number of executions (e.g., 5 times):
// setTimeout(() => timer.clear(), 5 * 60 * 1000);



