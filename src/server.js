require('dotenv').config;
require('../db/db.js')
const statsModel = require('../models/statsModel.js');
const {app,app2} = require('../index.js');
const later = require('@breejs/later');

const port = process.env.PORT
const port2 = process.env.PORT2
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});

app2.listen(port2, () => {
    console.log(`Example app listening on port ${port2}`);
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



