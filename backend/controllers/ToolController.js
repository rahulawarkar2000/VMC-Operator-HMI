const Tool = require("../models/Tool");


// CREATE TOOL
const createTool = async (req, res) => {

    try {

        const {
            toolNumber,
            toolType,
            cncProgram,
            programRevision
        } = req.body;

        const tool = await Tool.create({
            toolNumber,
            toolType,
            cncProgram,
            programRevision
        });

        res.status(201).json({
            success: true,
            message: "Tool created successfully",
            data: tool
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: "Failed to create tool",
            error: error.message
        });

    }
};


// GET ALL TOOLS
const getTools = async (req, res) => {

    try {

        const tools = await Tool.find();

        res.status(200).json({
            success: true,
            data: tools
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: "Failed to fetch tools",
            error: error.message
        });

    }
};


// GET SINGLE TOOL
const getToolById = async (req, res) => {

    try {

        const tool = await Tool.findById(req.params.id);

        if (!tool) {

            return res.status(404).json({
                success: false,
                message: "Tool not found"
            });

        }

        res.status(200).json({
            success: true,
            data: tool
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: "Failed to fetch tool",
            error: error.message
        });

    }
};


// CONFIRM TOOL
const confirmTool = async (req, res) => {

    try {

        const tool = await Tool.findByIdAndUpdate(
            req.params.id,
            {
                confirmed: true
            },
            {
                new: true
            }
        );

        if (!tool) {

            return res.status(404).json({
                success: false,
                message: "Tool not found"
            });

        }

        res.status(200).json({
            success: true,
            message: "Tool confirmed successfully",
            data: tool
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: "Failed to confirm tool",
            error: error.message
        });

    }
};


const DeleteTool = async (req, res) => {

    try {

        const tool = await Tool.findByIdAndDelete(req.params.id);

        if (!tool) {

            return res.status(404).json({
                success: false,
                message: "Tool not found"
            });

        }

        res.status(200).json({
            success: true,
            message: "Tool deleted successfully",
            data: tool
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: "Failed to delete tool",
            error: error.message
        });

    }
};

module.exports = {
    createTool,
    getTools,
    getToolById,
    confirmTool,
    DeleteTool
};