require('dotenv').config;
require('../db/db.js')
const statsModel = require('../models/statsModel.js');
const app= require('../index.js');
const later = require('@breejs/later');

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

const temp = async function temp() {
    await statsModel.create({});
}
temp()
setTimeout(() => timer.clear(), 5 * 60 * 1000);



