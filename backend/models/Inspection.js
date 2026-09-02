const mongoose = require("mongoose");

const inspectionSchema = new mongoose.Schema(
    {
        productionRun: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "ProductionRun",
            required: true
        },

        workpiece: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Workpiece",
            required: true
        },

        inspectorName: {
            type: String,
            required: true
        },

        result: {
            type: String,
            enum: ["passed", "failed"],
            required: true
        },

        inspectedQuantity: {
            type: Number,
            required: true,
            min: 1
        },

        rejectedQuantity: {
            type: Number,
            default: 0,
            min: 0
        },

        remarks: {
            type: String,
            default: ""
        },

        inspectionDate: {
            type: Date,
            default: Date.now
        }
    },
    {
        timestamps: true
    }
);

const Inspection = mongoose.model(
    "Inspection",
    inspectionSchema
);

module.exports = Inspection;