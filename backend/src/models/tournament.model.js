import mongoose, { mongo } from "mongoose";

const tournamentSchema = mongoose.Schema({
    title: {
        type: String,
        required: [true, 'title is required']
    },
    summary: {
        type: String,
        required: [true, 'summary is required']
    },
    startDate: {
        type: Date,
        required: [true, 'Start date is required']
    },
    startTime: {
        type: Date,
        required: [true, 'Start time is required'], 
    },
    description: {
        type: String,
        required: [true, 'Description is required']
    },
    coverImage: {
        type: String,
        required: [true, 'Cover Image is required']
    }
})

const Tournament = mongoose.model('Tournament', tournamentSchema)
export default Tournament