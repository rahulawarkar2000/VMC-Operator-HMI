const mongoose = require("mongoose");

const productionRunSchema = new mongoose.Schema(
    {
        workpiece: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Workpiece",
            required: true
        },

        operation: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Operation",
            required: true
        },

        machineNumber: {
            type: String,
            required: true
        },

        plannedQuantity: {
            type: Number,
            required: true,
            min: 1
        },

        producedQuantity: {
            type: Number,
            default: 0,
            min: 0
        },

        rejectedQuantity: {
            type: Number,
            default: 0,
            min: 0
        },

        status: {
            type: String,
            enum: [
                "planned",
                "running",
                "paused",
                "completed",
                "failed"
            ],
            default: "planned"
        },

        startTime: {
            type: Date
        },

        endTime: {
            type: Date
        }
    },
    {
        timestamps: true
    }
);

const ProductionRun = mongoose.model(
    "ProductionRun",
    productionRunSchema
);

module.exports = ProductionRun;
