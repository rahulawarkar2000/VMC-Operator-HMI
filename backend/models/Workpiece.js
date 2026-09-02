const mongoose = require("mongoose");

const workpieceSchema = new mongoose.Schema(
    {
        partNumber: {
            type: String,
            required: true
        },

        partName: {
            type: String,
            required: true
        },

        material: {
            type: String,
            required: true
        },

        quantity: {
            type: Number,
            required: true,
            min: 1
        },

        confirmed: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
);

const Workpiece = mongoose.model(
    "Workpiece",
    workpieceSchema
);

module.exports = Workpiece;