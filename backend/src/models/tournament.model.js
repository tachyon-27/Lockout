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
    },
    resultText: {
        type: String,
    },
    isWinner: {
        type: Boolean,
    },
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
}
)

participantSchema.virtual("id").get(function () {
    return this._id.toHexString();
});
participantSchema.virtual("name").get(function () {
    return this.cfid;
});

const problemSchema = mongoose.Schema({
    question: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Question"
    },
    points: {
        type: Number
    },
    solved: {
        type: String,
    }
})

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
    startTime: {
        type: Date,
    },
    state: {
        type: String,
        enum: ['NO_SHOW', 'RUNNING', 'WALK_OVER', 'NO_PARTY', 'DONE', 'SCORE_DONE', 'SCHEDULED'],
        required: true,
        default: 'SCHEDULED'
    },
    duration: {
        type: Number
    },
    participants: [participantSchema],
    problemList: {
        type: [problemSchema],
        default: []
    }
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