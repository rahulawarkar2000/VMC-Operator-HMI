const mongoose = require("mongoose");

const productionRunToolSchema = new mongoose.Schema(
    {
        productionRun: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "ProductionRun",
            required: true
        },

        tool: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Tool",
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

productionRunToolSchema.index(
    { productionRun: 1, tool: 1 },
    { unique: true }
);

const ProductionRunTool = mongoose.model(
    "ProductionRunTool",
    productionRunToolSchema
);

module.exports = ProductionRunTool;
