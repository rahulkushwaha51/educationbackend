require('dotenv').config();
const mongoose = require("mongoose");
const db_link = process.env.DATABASE_URL;
mongoose
    .connect(db_link)
    .then((db) => {
        console.log("Database connected");
        // Any code that depends on the database connection should go here
    })
    .catch((err) => {
        console.log(err);
    });
