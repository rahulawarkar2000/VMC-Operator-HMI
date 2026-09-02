const express = require("express");

const router = express.Router();

const {
    createWorkpiece,
    getAllWorkpieces,
    getWorkpieceById,
    updateWorkpiece,
    deleteWorkpiece
} = require("../controllers/workpieceController");


// CREATE
router.post("/", createWorkpiece);


// GET ALL
router.get("/", getAllWorkpieces);


// GET BY ID
router.get("/:id", getWorkpieceById);


// UPDATE
router.put("/:id", updateWorkpiece);


// DELETE
router.delete("/:id", deleteWorkpiece);


module.exports = router;