import mongoose from 'mongoose'
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
        type: Boolean,
        default: false
    },
    verifyCode: {
        type: Number
    },
    verifyCodeExpiry: {
        type: Date
    },
    canChangePassword: {
        type: Boolean
    }
},
{
    timestamps: true,
})

const User = mongoose.model('User', userSchema)

export default User