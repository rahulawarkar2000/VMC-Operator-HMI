const express = require("express");

const router = express.Router();

const {
    createInspection,
    getAllInspections,
    getInspectionById,
    updateInspection,
    deleteInspection
} = require("../controllers/inspectionController");


// CREATE
router.post("/", createInspection);



// GET ALL
router.get("/", getAllInspections);


// GET BY ID
router.get("/:id", getInspectionById);


// UPDATE
router.put("/:id", updateInspection);


// DELETE
router.delete("/:id", deleteInspection);


module.exports = router;