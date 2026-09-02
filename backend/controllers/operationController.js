const Operation = require("../models/Operation");


// CREATE OPERATION

const createOperation = async (req, res) => {
    try {
      
        const {
            operationNumber,
            operationName,
            workpiece,
            tool,
            cncProgram,
            spindleSpeed,
            feedRate,
            operationTime,
            status
        } = req.body;


        const operation = await Operation.create({
            operationNumber,
            operationName,
            workpiece,
            tool,
            cncProgram,
            spindleSpeed,
            feedRate,
            operationTime,
            status
        });

        res.status(201).json({
            success: true,
            message: "Operation created successfully",
            data: operation
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: "Failed to create operation",
            error: error.message
        });

    }
};


// GET ALL OPERATIONS

const getAllOperations = async (req, res) => {
    try {

        const operations = await Operation.find()
            .populate("workpiece")
            .populate("tool");

        res.status(200).json({
            success: true,
            count: operations.length,
            data: operations
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: "Failed to fetch operations",
            error: error.message
        });

    }
};


// GET OPERATION BY ID

const getOperationById = async (req, res) => {
    try {

        const operation = await Operation.findById(req.params.id)
            .populate("workpiece")
            .populate("tool");

        if (!operation) {
            return res.status(404).json({
                success: false,
                message: "Operation not found"
            });
        }

        res.status(200).json({
            success: true,
            data: operation
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: "Failed to fetch operation",
            error: error.message
        });

    }
};


// UPDATE OPERATION

const updateOperation = async (req, res) => {
    try {

        const operation = await Operation.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        )
            .populate("workpiece")
            .populate("tool");

        if (!operation) {
            return res.status(404).json({
                success: false,
                message: "Operation not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Operation updated successfully",
            data: operation
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: "Failed to update operation",
            error: error.message
        });

    }
};


// DELETE OPERATION

const deleteOperation = async (req, res) => {
    try {

        const operation = await Operation.findByIdAndDelete(
            req.params.id
        );

        if (!operation) {
            return res.status(404).json({
                success: false,
                message: "Operation not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Operation deleted successfully",
            data: operation
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: "Failed to delete operation",
            error: error.message
        });

    }
};


// UPDATE OPERATION STATUS

const updateOperationStatus = async (req, res) => {
    try {

        const { status } = req.body;

        const operation = await Operation.findByIdAndUpdate(
            req.params.id,
            { status },
            {
                new: true,
                runValidators: true
            }
        );

        if (!operation) {
            return res.status(404).json({
                success: false,
                message: "Operation not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Operation status updated successfully",
            data: operation
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: "Failed to update operation status",
            error: error.message
        });

    }
};


module.exports = {
    createOperation,
    getAllOperations,
    getOperationById,
    updateOperation,
    deleteOperation,
    updateOperationStatus
};
