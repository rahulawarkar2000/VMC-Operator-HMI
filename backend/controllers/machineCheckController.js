const MachineCheck = require("../models/MachineCheckmodel");


// Get all machine checks

const getMachineChecks = async (req, res) => {

    try {

        const checks = await MachineCheck.find();

        res.status(200).json({
            success: true,
            data: checks,
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: "Failed to fetch machine checks",
            error: error.message,
        });

    }
};


// Get single machine check

const getMachineCheckById = async (req, res) => {

    try {

        const check = await MachineCheck.findById(req.params.id);

        if (!check) {

            return res.status(404).json({
                success: false,
                message: "Machine check not found",
            });

        }

        res.status(200).json({
            success: true,
            data: check,
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: "Failed to fetch machine check",
            error: error.message,
        });

    }
};


// Create machine check

const createMachineCheck = async (req, res) => {

    try {

        const { name , confirmed } = req.body;

        const check = await MachineCheck.create({
            name,
            confirmed 
        });

        res.status(201).json({
            success: true,
            message: "Machine check created",
            data: check,
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: "Failed to create machine check",
            error: error.message,
        });

    }
};

const DeleteMachineCheck = async (req, res) => {

    try {

        const { id } = req.body;

        const check = await MachineCheck.deleteOne({
            _id: id
        });

        res.status(200).json({
            success: true,
            message: "Machine check deleted",
            data: check,
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: "Failed to delete machine check",
            error: error.message,
        });

    }
};


// Confirm machine check

const confirmMachineCheck = async (req, res) => {

    try {

        const check = await MachineCheck.findByIdAndUpdate(
            req.params.id,
            {
                confirmed: true,
            },
            {
                new: true,
            }
        );

        if (!check) {

            return res.status(404).json({
                success: false,
                message: "Machine check not found",
            });

        }

        res.status(200).json({
            success: true,
            message: "Machine check confirmed",
            data: check,
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: "Failed to confirm machine check",
            error: error.message,
        });

    }
};





module.exports = {
    getMachineChecks,
    getMachineCheckById,
    createMachineCheck,
    confirmMachineCheck,
    DeleteMachineCheck
};