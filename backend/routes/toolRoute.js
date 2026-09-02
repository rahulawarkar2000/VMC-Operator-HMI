const express = require("express");

const router = express.Router();

const {
    createTool,
    getTools,
    getToolById,
    confirmTool,
    DeleteTool
} = require("../controllers/ToolController");


// CREATE
router.post("/", createTool);


// GET ALL
router.get("/", getTools);


// GET ONE
router.get("/:id", getToolById);


// CONFIRM
router.put("/:id/confirm", confirmTool);

router.delete("/:id", DeleteTool);



module.exports = router;