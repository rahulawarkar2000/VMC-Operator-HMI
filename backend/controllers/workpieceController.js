const Workpiece = require("../models/Workpiece");


// CREATE
const createWorkpiece = async (req, res) => {
    try {

        const {
            partNumber,
            partName,
            material,
            quantity
        } = req.body;

        const workpiece = await Workpiece.create({
            partNumber,
            partName,
            material,
            quantity
        });

        res.status(201).json({
            success: true,
            message: "Workpiece created successfully",
            data: workpiece
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: "Failed to create workpiece",
            error: error.message
        });

    }
};


// GET ALL
const getAllWorkpieces = async (req, res) => {
    try {

        const workpieces = await Workpiece.find();

        res.status(200).json({
            success: true,
            message: "Workpieces fetched successfully",
            count: workpieces.length,
            data: workpieces
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: "Failed to fetch workpieces",
            error: error.message
        });

    }
};


// GET BY ID
const getWorkpieceById = async (req, res) => {
    try {

        const workpiece = await Workpiece.findById(req.params.id);

        if (!workpiece) {
            return res.status(404).json({
                success: false,
                message: "Workpiece not found"
            });
        }

        res.status(200).json({
            success: true,
            data: workpiece
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: "Failed to fetch workpiece",
            error: error.message
        });

    }
};


// UPDATE
const updateWorkpiece = async (req, res) => {
    try {

        const workpiece = await Workpiece.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!workpiece) {
            return res.status(404).json({
                success: false,
                message: "Workpiece not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Workpiece updated successfully",
            data: workpiece
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: "Failed to update workpiece",
            error: error.message
        });

    }
};


// DELETE
const deleteWorkpiece = async (req, res) => {
    try {

        const workpiece = await Workpiece.findByIdAndDelete(
            req.params.id
        );

        if (!workpiece) {
            return res.status(404).json({
                success: false,
                message: "Workpiece not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Workpiece deleted successfully",
            data: workpiece
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: "Failed to delete workpiece",
            error: error.message
        });

    }
};


module.exports = {
    createWorkpiece,
    getAllWorkpieces,
    getWorkpieceById,
    updateWorkpiece,
    deleteWorkpiece
};