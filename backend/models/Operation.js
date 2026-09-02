const mongoose = require("mongoose");

const operationSchema = new mongoose.Schema(
    {
        productionRun: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "ProductionRun"
        },

        operationNumber: {
            type: Number,
            required: true
        },

        operationName: {
            type: String,
            required: true
        },

        workpiece: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Workpiece",
            required: true
        },

        tool: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Tool",
            required: true
        },

        cncProgram: {
            type: String,
            required: true
        },

        spindleSpeed: {
            type: Number,
            required: true
        },

        feedRate: {
            type: Number,
            required: true
        },

        operationTime: {
            type: Number,
            required: true
        },

        status: {
            type: String,
            enum: ["pending", "running", "completed", "failed"],
            default: "pending"
        }
    },
    {
        timestamps: true
    }
);

const Operation = mongoose.model("Operation", operationSchema);

module.exports = Operation;

