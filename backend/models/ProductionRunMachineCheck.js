const mongoose = require("mongoose");

const productionRunMachineCheckSchema = new mongoose.Schema(
    {
        productionRun: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "ProductionRun",
            required: true
        },

        machineCheck: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "MachineCheck",
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

productionRunMachineCheckSchema.index(
    { productionRun: 1, machineCheck: 1 },
    { unique: true }
);

const ProductionRunMachineCheck = mongoose.model(
    "ProductionRunMachineCheck",
    productionRunMachineCheckSchema
);

module.exports = ProductionRunMachineCheck;
