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
}, {
    timestamps: true
}
)

const matchParticipantSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Please specify the parrticipant name"],
        },
        resultText: {
            type: String,
        },
        isWinner: {
            type: Boolean,
        },
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
)

matchParticipantSchema.virtual("id").get(function () {
    return this._id.toHexString();
});


const matchSchema = mongoose.Schema({
    id: {
        type: Number,
        required: [true, "Match cannot be made without an match id!"]
    },
    name: {
        type: String,
    },
    nextMatchId: {
        type: Number,
        default: null,
    },
    tournamentRoundText: {
        type: Number,
        required: [true, "Specify the round header"]
    },
    state: {
        type: String,
        enum: ['NO_SHOW', 'WALK_OVER', 'NO_PARTY', 'DONE', 'SCORE_DONE', 'SCHEDULED'],
        required: true,
        default: 'SCHEDULED'
    },
    participants: [matchParticipantSchema],
    problemList: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Question"
        }
    ]
})

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
    },
    matches: [matchSchema],
})

const Tournament = mongoose.model('Tournament', tournamentSchema)
export default Tournament