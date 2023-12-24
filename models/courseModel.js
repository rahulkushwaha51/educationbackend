const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please enter course title'],
        unique: true,
        minlength: [4, "title must be at least 4 character"],
        maxlength: [40, 'plan name should not exceed more than 20 character'],
    },

    description: {
        type: String,
        required: [true, "please enter course title"],
        minlength: [20, "title must be at least 20 characters"],
    },

    lectures: [{
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        video: {
            public_id: {
                type: String,
                // required: true,
            },
            url: {
                type: String,
                // required: true
            }
        }
    }],

    poster: {
        public_id: {
            type: String,
            // required: true,
        },
        url: {
            type: String,
            // required: true
        },
    },

    views: {
        type: Number,
        default: 0,
    },
    numofVideos: {
        type: Number,
        default: 0,
    },

    category: {
        type: String,
        required: true,
    },

    CreatedBy: {
        type: String,
        required: true,
    },
    CreatedAt: {
        type: Date,
        default: Date.now,
    },
    // duration: {
    //     type: Number,
    //     required: [true,"enter duration"]
    // },
    // price: {
    //     type: Number,
    //     required: [true, 'price not entered']
    // },
    // level: {
    //     type: String,
    //     default: "beginner"
    // },
    // ratingsAverage: {
    //     type: Number,
    //     default: 1
    // },
    // discount: {
    //     type: Number,
    //     validate: [function () {
    //         return this.discount < 100
    //     }, 'discount cannot be more than price']
    // },
})

const courseModel = mongoose.model('courseModel', courseSchema);

module.exports = courseModel;