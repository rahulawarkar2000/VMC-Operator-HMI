const Inspection = require("../models/Inspection");


// CREATE INSPECTION

const createInspection = async (req, res) => {
    try {

        const {
            productionRun,
            workpiece,
            inspectorName,
            result,
            inspectedQuantity,
            rejectedQuantity,
            remarks
        } = req.body;

        const inspection = await Inspection.create({
            productionRun,
            workpiece,
            inspectorName,
            result,
            inspectedQuantity,
            rejectedQuantity,
            remarks
        });

        res.status(201).json({
            success: true,
            message: "Inspection created successfully",
            data: inspection
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: "Failed to create inspection",
            error: error.message
        });

    }
};


// GET ALL INSPECTIONS

const getAllInspections = async (req, res) => {
    try {

        const inspections = await Inspection.find()
            .populate("productionRun")
            .populate("workpiece");

        res.status(200).json({
            success: true,
            count: inspections.length,
            data: inspections
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: "Failed to fetch inspections",
            error: error.message
        });

    }
};


// GET INSPECTION BY ID

const getInspectionById = async (req, res) => {
    try {

        const inspection = await Inspection.findById(req.params.id)
            .populate("productionRun")
            .populate("workpiece");

        if (!inspection) {
            return res.status(404).json({
                success: false,
                message: "Inspection not found"
            });
        }

        res.status(200).json({
            success: true,
            data: inspection
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: "Failed to fetch inspection",
            error: error.message
        });

    }
};


// UPDATE INSPECTION

const updateInspection = async (req, res) => {
    try {

        const inspection = await Inspection.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        )
            .populate("productionRun")
            .populate("workpiece");

        if (!inspection) {
            return res.status(404).json({
                success: false,
                message: "Inspection not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Inspection updated successfully",
            data: inspection
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: "Failed to update inspection",
            error: error.message
        });

    }
};


// DELETE INSPECTION

const deleteInspection = async (req, res) => {
    try {

        const inspection = await Inspection.findByIdAndDelete(
            req.params.id
        );

        if (!inspection) {
            return res.status(404).json({
                success: false,
                message: "Inspection not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Inspection deleted successfully",
            data: inspection
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: "Failed to delete inspection",
            error: error.message
        });

    }
};


module.exports = {
    createInspection,
    getAllInspections,
    getInspectionById,
    updateInspection,
    deleteInspection
};

