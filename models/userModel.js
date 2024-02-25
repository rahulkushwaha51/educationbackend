require('dotenv').config();
const mongoose = require("mongoose");
const emailValidator = require("email-validator")
const bcrypt = require('bcrypt')
const crypto = require('crypto')
const jwt = require('jsonwebtoken')
const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "please enter your name"]
    },
    email: {
        type: String,
        required: [true, 'please enter your email'],
        unique: true,
        validate: function () {
            return emailValidator.validate(this.email);
        }
    },
    password: {
        type: String,
        required: [true, "please enter your password"],
        minLength: 8,
        select: false
    },
    // confirmpassword: {
    //     type: String,
    //     required: [true, "Password need to be similar"],
    //     minLength: 8,
    //     validate: function () {
    //         return this.confirmpassword === this.password
    //     }
    // },
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user',
    },
    subscription: {
        id: String,
        status: String
    },
    avatar: {
        public_id: {

            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        }
    },

    playlist: [{
        course: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "courseModel"
        },
        poster: String,
    },],
    order: {
       id: String,
    },

    purchasedcourse: [],
    createdAt: {
        type: Date,
        default: Date.now
    },
    resetPasswordToken: String,
    resetPasswordExpire: String,
},
    {
        timestamps: true
    });
// userSchema.pre('save', function () {
//     return this.confirmpassword = undefined;
// })

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next()
    this.password = await bcrypt.hash(this.password, 10);
    next();
})

userSchema.methods.getJWTToken = function () {
    // creating resettoken using npm package crypto 
    return jwt.sign({ _id: this._id }, process.env.JWT_KEY, {
        expiresIn: "15d",
    });
}
userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
}
userSchema.methods.getResetToken = function (req, res, next) {
    const resetToken = crypto.randomBytes(20).toString("hex");
    this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
    return resetToken;

}

const userModel = mongoose.model('userModel', userSchema);
module.exports = userModel;