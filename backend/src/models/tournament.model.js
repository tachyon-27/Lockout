import mongoose, { mongo, Mongoose } from "mongoose";
import { questionSchema } from "./question.model.js";

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
    totalPoints: {
        type: Number,
    }
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
        type: questionSchema,
    },
    points: {
        type: Number
    },
    solved: {
        type: String,
    }
})

const tieBreakerSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    question: {
        type: String,
        required: true,
    },
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
    endTime: {
        type: Date,
    },
    state: {
        type: String,
        enum: ['NO_SHOW', 'TIE', 'RUNNING', 'WALK_OVER', 'NO_PARTY', 'DONE', 'SCORE_DONE', 'SCHEDULED'],
        required: true,
        default: 'SCHEDULED'
    },
    winner: {
        type: String,
    },
    duration: {
        type: Number
    },
    tieBreakers: [tieBreakerSchema],
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
    endDate: {
        type: Date,
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
    showDetails: {
        type: Boolean,
        default: false
    },
},{
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
})

tournamentSchema.virtual("tieBreakers").get(function () {
    return this.matches.flatMap(match => match.tieBreakers || []);
});

const Tournament = mongoose.model('Tournament', tournamentSchema)
export default Tournament