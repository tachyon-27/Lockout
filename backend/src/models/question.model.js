import mongoose from 'mongoose'

const questionSchema = mongoose.Schema({
    contestId: {
        type: String,
        required: true
    },
    index: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: true
    }
})

const Question = mongoose.model('Question', questionSchema)

export default Question