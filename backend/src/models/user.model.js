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
        default: null
    },
    verifyCode: {
        type: Number
    },
    verifyCodeExpiry: {
        type: Date
    }
},
{
    timestamps: true,
})

const User = mongoose.model('User', userSchema)

export default User