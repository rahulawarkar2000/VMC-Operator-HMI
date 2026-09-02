const express = require("express");

const router = express.Router();

const {
    createOperation,
    getAllOperations,
    getOperationById,
    updateOperation,
    deleteOperation,
    updateOperationStatus
} = require("../controllers/operationController");



router.post("/", createOperation);


router.get("/", getAllOperations);



router.get("/:id", getOperationById);



router.put("/:id", updateOperation);



router.delete("/:id", deleteOperation);


router.patch("/:id/status", updateOperationStatus);


module.exports = router;