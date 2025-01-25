import mongoose, { mongo, Mongoose } from "mongoose";

const participantSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    cfid: {
        type: String,
        required: true
    },
    maxRating: {
        type: Number
    }
},{
        timestamps: true
    }
)

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
    description: {
        type: String,
        required: [true, 'Description is required']
    },
    coverImage: {
        type: String,
        required: [true, 'Cover Image is required']
    },
    participants: {
        type: [participantSchema],  
        default: [] 
    }
})

const Tournament = mongoose.model('Tournament', tournamentSchema)
export default Tournament