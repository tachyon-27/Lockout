import mongoose from 'mongoose'

const codeforcesIDSchema = mongoose.Schema({
    cfid: {
        type: String,
        required: true,
        unique: true
    },
    verifyString: {
        type: String
    },
    isVerified: {
        type: Boolean,
        required: true,
        default: false
    }
})

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name']
    },
    email: {
        type: String,
        required: [true, 'Please add a Email'],
        unique: true
    },
    password: {
        type: String,
        default: null,
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    githubAccessToken: {
        type: String,
    },
    isGoogle: {
        type: Boolean
    },
    verifyCode: {
        type: Number
    },
    verifyCodeExpiry: {
        type: Date
    },
    canChangePassword: {
        type: Boolean
    },
    isAdmin: {
        type: Boolean
    },
    codeforcesID: {
        type: [codeforcesIDSchema],
        default: []
    }
},
{
    timestamps: true,
})

const User = mongoose.model('User', userSchema)

export default User