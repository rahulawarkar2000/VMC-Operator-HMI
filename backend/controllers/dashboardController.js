const Tool = require("../models/Tool");
const Workpiece = require("../models/Workpiece");
const Operation = require("../models/Operation");
const ProductionRun = require("../models/ProductionRun");
const Inspection = require("../models/Inspection");


const getDashboardSummary = async (req, res) => {
    try {

        // Total counts

        const totalTools = await Tool.countDocuments();

        const totalWorkpieces = await Workpiece.countDocuments();

        const totalOperations = await Operation.countDocuments();

        const totalProductionRuns =
            await ProductionRun.countDocuments();


        // Production quantity

        const productionSummary =
            await ProductionRun.aggregate([
                {
                    $group: {
                        _id: null,
                        plannedQuantity: {
                            $sum: "$plannedQuantity"
                        },
                        producedQuantity: {
                            $sum: "$producedQuantity"
                        },
                        rejectedQuantity: {
                            $sum: "$rejectedQuantity"
                        }
                    }
                }
            ]);


        const production = productionSummary[0] || {
            plannedQuantity: 0,
            producedQuantity: 0,
            rejectedQuantity: 0
        };


        // Production status

        const completedRuns =
            await ProductionRun.countDocuments({
                status: "completed"
            });

        const runningRuns =
            await ProductionRun.countDocuments({
                status: "running"
            });

        const failedRuns =
            await ProductionRun.countDocuments({
                status: "failed"
            });


        // Inspection summary

        const passedInspections =
            await Inspection.countDocuments({
                result: "passed"
            });

        const failedInspections =
            await Inspection.countDocuments({
                result: "failed"
            });


        res.status(200).json({

            success: true,

            data: {

                tools: {
                    total: totalTools
                },

                workpieces: {
                    total: totalWorkpieces
                },

                operations: {
                    total: totalOperations
                },

                productionRuns: {
                    total: totalProductionRuns,
                    completed: completedRuns,
                    running: runningRuns,
                    failed: failedRuns
                },

                production: {
                    planned: production.plannedQuantity,
                    produced: production.producedQuantity,
                    rejected: production.rejectedQuantity
                },

                inspection: {
                    passed: passedInspections,
                    failed: failedInspections
                }

            }

        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: "Failed to fetch dashboard summary",
            error: error.message
        });

    }
};


module.exports = {
    getDashboardSummary
};