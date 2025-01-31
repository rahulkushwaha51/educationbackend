const mongoose = require("mongoose");

const statsSchema = new mongoose.Schema({
    users: {
        type: Number,
        default: 0
    },

    subscription: {
        type: Number,
        default: 0
    },

    views: {
        type: Number,
        default: 0,
    },

    CreatedAt: {
        type: Date,
        default: Date.now,
    },

},
    {
        timestamps: true
    }
);

const statsModel = mongoose.model('statsModel', statsSchema);

module.exports = statsModel;
