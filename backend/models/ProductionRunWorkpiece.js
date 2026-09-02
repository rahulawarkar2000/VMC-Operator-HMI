const mongoose = require("mongoose");

const productionRunWorkpieceSchema = new mongoose.Schema(
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

        confirmed: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
);

productionRunWorkpieceSchema.index(
    { productionRun: 1, workpiece: 1 },
    { unique: true }
);

const ProductionRunWorkpiece = mongoose.model(
    "ProductionRunWorkpiece",
    productionRunWorkpieceSchema
);

module.exports = ProductionRunWorkpiece;
