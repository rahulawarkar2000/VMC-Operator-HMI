const mongoose = require("mongoose");

const ProductionRun = require("../models/ProductionRun");
const Operation = require("../models/Operation");
const MachineCheck = require("../models/MachineCheckmodel");
const Tool = require("../models/Tool");
const Workpiece = require("../models/Workpiece");
const ProductionRunMachineCheck = require("../models/ProductionRunMachineCheck");
const ProductionRunTool = require("../models/ProductionRunTool");
const ProductionRunWorkpiece = require("../models/ProductionRunWorkpiece");

const validStatuses = ["planned", "running", "paused", "completed", "failed"];

const isValidObjectId = (id) => {
    return mongoose.Types.ObjectId.isValid(id);
};

const ensureProductionRunExists = async (productionRunId) => {
    const productionRun = await ProductionRun.findById(productionRunId);

    if (!productionRun) {
        return null;
    }

    return productionRun;
};

// CREATE PRODUCTION RUN

const createProductionRun = async (req, res) => {
    try {

        const {
            workpiece,
            operation,
            machineNumber,
            plannedQuantity,
            rejectedQuantity,
            status
        } = req.body;

        if (!workpiece || !operation || !machineNumber || !plannedQuantity) {
            return res.status(400).json({
                success: false,
                message: "workpiece, operation, machineNumber and plannedQuantity are required"
            });
        }

        if (!isValidObjectId(workpiece) || !isValidObjectId(operation)) {
            return res.status(400).json({
                success: false,
                message: "Invalid workpiece or operation id"
            });
        }

        const workpieceExists = await Workpiece.findById(workpiece);
        const operationExists = await Operation.findById(operation);

        if (!workpieceExists) {
            return res.status(404).json({
                success: false,
                message: "Workpiece not found"
            });
        }

        if (!operationExists) {
            return res.status(404).json({
                success: false,
                message: "Operation not found"
            });
        }

        if (status && !validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid production status"
            });
        }

        const productionRun = await ProductionRun.create({
            workpiece,
            operation,
            machineNumber,
            plannedQuantity,
            producedQuantity: 0,
            rejectedQuantity: rejectedQuantity || 0,
            status: status || "running",
            startTime: new Date()
        });

        res.status(201).json({
            success: true,
            message: "Production run created successfully",
            data: productionRun
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: "Failed to create production run",
            error: error.message
        });

    }
};


// GET ALL PRODUCTION RUNS

const getAllProductionRuns = async (req, res) => {
    try {

        const productionRuns = await ProductionRun.find()
            .populate("workpiece")
            .populate("operation");

        res.status(200).json({
            success: true,
            count: productionRuns.length,
            data: productionRuns
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: "Failed to fetch production runs",
            error: error.message
        });

    }
};

const getProductionRunMachineChecks = async (req, res) => {
    try {
        const { id } = req.params;

        if (!isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid production run id"
            });
        }

        const productionRun = await ensureProductionRunExists(id);

        if (!productionRun) {
            return res.status(404).json({
                success: false,
                message: "Production run not found"
            });
        }

        const machineChecks = await MachineCheck.find();

        const runChecks = await Promise.all(
            machineChecks.map(async (check) => {
                const runData = await ProductionRunMachineCheck.findOne({
                    productionRun: id,
                    machineCheck: check._id
                }).lean();

                return {
                    ...check.toObject(),
                    confirmed: Boolean(runData?.confirmed)
                };
            })
        );

        return res.status(200).json({
            success: true,
            data: runChecks
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch production run machine checks",
            error: error.message
        });
    }
};

const confirmProductionRunMachineCheck = async (req, res) => {
    try {
        const { id, checkId } = req.params;

        if (!isValidObjectId(id) || !isValidObjectId(checkId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid production run or machine check id"
            });
        }

        const productionRun = await ensureProductionRunExists(id);

        if (!productionRun) {
            return res.status(404).json({
                success: false,
                message: "Production run not found"
            });
        }

        const machineCheck = await MachineCheck.findById(checkId);

        if (!machineCheck) {
            return res.status(404).json({
                success: false,
                message: "Machine check not found"
            });
        }

        const existing = await ProductionRunMachineCheck.findOne({
            productionRun: id,
            machineCheck: checkId
        });

        if (existing && existing.confirmed) {
            return res.status(409).json({
                success: false,
                message: "Machine check already confirmed for this production run"
            });
        }

        const record = await ProductionRunMachineCheck.findOneAndUpdate(
            { productionRun: id, machineCheck: checkId },
            { confirmed: true },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );

        return res.status(200).json({
            success: true,
            message: "Machine check confirmed for production run",
            data: {
                ...machineCheck.toObject(),
                confirmed: Boolean(record.confirmed)
            }
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to confirm machine check for production run",
            error: error.message
        });
    }
};

const getProductionRunTools = async (req, res) => {
    try {
        const { id } = req.params;

        if (!isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid production run id"
            });
        }

        const productionRun = await ensureProductionRunExists(id);

        if (!productionRun) {
            return res.status(404).json({
                success: false,
                message: "Production run not found"
            });
        }

        const tools = await Tool.find();

        const runTools = await Promise.all(
            tools.map(async (tool) => {
                const runData = await ProductionRunTool.findOne({
                    productionRun: id,
                    tool: tool._id
                }).lean();

                return {
                    ...tool.toObject(),
                    confirmed: Boolean(runData?.confirmed)
                };
            })
        );

        return res.status(200).json({
            success: true,
            data: runTools
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch production run tools",
            error: error.message
        });
    }
};

const confirmProductionRunTool = async (req, res) => {
    try {
        const { id, toolId } = req.params;

        if (!isValidObjectId(id) || !isValidObjectId(toolId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid production run or tool id"
            });
        }

        const productionRun = await ensureProductionRunExists(id);

        if (!productionRun) {
            return res.status(404).json({
                success: false,
                message: "Production run not found"
            });
        }

        const tool = await Tool.findById(toolId);

        if (!tool) {
            return res.status(404).json({
                success: false,
                message: "Tool not found"
            });
        }

        const existing = await ProductionRunTool.findOne({
            productionRun: id,
            tool: toolId
        });

        if (existing && existing.confirmed) {
            return res.status(409).json({
                success: false,
                message: "Tool already confirmed for this production run"
            });
        }

        const record = await ProductionRunTool.findOneAndUpdate(
            { productionRun: id, tool: toolId },
            { confirmed: true },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );

        return res.status(200).json({
            success: true,
            message: "Tool confirmed for production run",
            data: {
                ...tool.toObject(),
                confirmed: Boolean(record.confirmed)
            }
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to confirm tool for production run",
            error: error.message
        });
    }
};

const getProductionRunWorkpieces = async (req, res) => {
    try {
        const { id } = req.params;

        if (!isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid production run id"
            });
        }

        const productionRun = await ensureProductionRunExists(id);

        if (!productionRun) {
            return res.status(404).json({
                success: false,
                message: "Production run not found"
            });
        }

        const workpieces = await Workpiece.find();

        const runWorkpieces = await Promise.all(
            workpieces.map(async (workpiece) => {
                const runData = await ProductionRunWorkpiece.findOne({
                    productionRun: id,
                    workpiece: workpiece._id
                }).lean();

                return {
                    ...workpiece.toObject(),
                    confirmed: Boolean(runData?.confirmed)
                };
            })
        );

        return res.status(200).json({
            success: true,
            data: runWorkpieces
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch production run workpieces",
            error: error.message
        });
    }
};

const confirmProductionRunWorkpiece = async (req, res) => {
    try {
        const { id, workpieceId } = req.params;

        if (!isValidObjectId(id) || !isValidObjectId(workpieceId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid production run or workpiece id"
            });
        }

        const productionRun = await ensureProductionRunExists(id);

        if (!productionRun) {
            return res.status(404).json({
                success: false,
                message: "Production run not found"
            });
        }

        const workpiece = await Workpiece.findById(workpieceId);

        if (!workpiece) {
            return res.status(404).json({
                success: false,
                message: "Workpiece not found"
            });
        }

        const existing = await ProductionRunWorkpiece.findOne({
            productionRun: id,
            workpiece: workpieceId
        });

        if (existing && existing.confirmed) {
            return res.status(409).json({
                success: false,
                message: "Workpiece already confirmed for this production run"
            });
        }

        const record = await ProductionRunWorkpiece.findOneAndUpdate(
            { productionRun: id, workpiece: workpieceId },
            { confirmed: true },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );

        return res.status(200).json({
            success: true,
            message: "Workpiece confirmed for production run",
            data: {
                ...workpiece.toObject(),
                confirmed: Boolean(record.confirmed)
            }
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to confirm workpiece for production run",
            error: error.message
        });
    }
};

const getProductionRunReadiness = async (req, res) => {
    try {
        const { id } = req.params;

        if (!isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid production run id"
            });
        }

        const productionRun = await ensureProductionRunExists(id);

        if (!productionRun) {
            return res.status(404).json({
                success: false,
                message: "Production run not found"
            });
        }

        const machineChecks = await MachineCheck.find();
        const tools = await Tool.find();
        const workpieces = await Workpiece.find();

        const machineChecksCompleted = machineChecks.length > 0 &&
            (await Promise.all(machineChecks.map(async (check) => {
                const record = await ProductionRunMachineCheck.findOne({
                    productionRun: id,
                    machineCheck: check._id
                }).lean();
                return Boolean(record?.confirmed);
            }))).every(Boolean);

        const toolsCompleted = tools.length > 0 &&
            (await Promise.all(tools.map(async (tool) => {
                const record = await ProductionRunTool.findOne({
                    productionRun: id,
                    tool: tool._id
                }).lean();
                return Boolean(record?.confirmed);
            }))).every(Boolean);

        const workpiecesCompleted = workpieces.length > 0 &&
            (await Promise.all(workpieces.map(async (workpiece) => {
                const record = await ProductionRunWorkpiece.findOne({
                    productionRun: id,
                    workpiece: workpiece._id
                }).lean();
                return Boolean(record?.confirmed);
            }))).every(Boolean);

        return res.status(200).json({
            success: true,
            data: {
                ready: machineChecksCompleted && toolsCompleted && workpiecesCompleted,
                machineChecksCompleted,
                toolsCompleted,
                workpiecesCompleted
            }
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to check production run readiness",
            error: error.message
        });
    }
};


// GET PRODUCTION RUN BY ID

const getProductionRunById = async (req, res) => {
    try {

        const productionRun = await ProductionRun.findById(
            req.params.id
        )
            .populate("workpiece")
            .populate("operation");

        if (!productionRun) {
            return res.status(404).json({
                success: false,
                message: "Production run not found"
            });
        }

        res.status(200).json({
            success: true,
            data: productionRun
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: "Failed to fetch production run",
            error: error.message
        });

    }
};


// UPDATE PRODUCTION RUN

const updateProductionRun = async (req, res) => {
    try {

        const productionRun =
            await ProductionRun.findByIdAndUpdate(
                req.params.id,
                req.body,
                {
                    new: true,
                    runValidators: true
                }
            )
            .populate("workpiece")
            .populate("operation");

        if (!productionRun) {
            return res.status(404).json({
                success: false,
                message: "Production run not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Production run updated successfully",
            data: productionRun
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: "Failed to update production run",
            error: error.message
        });

    }
};


// DELETE PRODUCTION RUN

const deleteProductionRun = async (req, res) => {
    try {

        const productionRun =
            await ProductionRun.findByIdAndDelete(
                req.params.id
            );

        if (!productionRun) {
            return res.status(404).json({
                success: false,
                message: "Production run not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Production run deleted successfully",
            data: productionRun
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: "Failed to delete production run",
            error: error.message
        });

    }
};


// UPDATE STATUS

const updateProductionStatus = async (req, res) => {
    try {

        const { status } = req.body;

        const productionRun =
            await ProductionRun.findByIdAndUpdate(
                req.params.id,
                { status },
                {
                    new: true,
                    runValidators: true
                }
            );

        if (!productionRun) {
            return res.status(404).json({
                success: false,
                message: "Production run not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Production status updated successfully",
            data: productionRun
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: "Failed to update production status",
            error: error.message
        });

    }
};


module.exports = {
    createProductionRun,
    getAllProductionRuns,
    getProductionRunById,
    updateProductionRun,
    deleteProductionRun,
    updateProductionStatus,
    getProductionRunMachineChecks,
    confirmProductionRunMachineCheck,
    getProductionRunTools,
    confirmProductionRunTool,
    getProductionRunWorkpieces,
    confirmProductionRunWorkpiece,
    getProductionRunReadiness
};

