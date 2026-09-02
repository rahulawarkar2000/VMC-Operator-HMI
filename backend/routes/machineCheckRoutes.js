const express = require("express");

const router = express.Router();

const {
    getMachineChecks,
    getMachineCheckById,
    createMachineCheck,
    confirmMachineCheck,
    DeleteMachineCheck
} = require("../controllers/machineCheckController");


// Get all checks

router.get(
    "/",
    getMachineChecks
);


// Get single check

router.get(
    "/:id",
    getMachineCheckById
);


// Create check

router.post(
    "/",
    createMachineCheck
);


// Confirm check

router.put(
    "/:id/confirm",
    confirmMachineCheck
);

router.delete("/:id", DeleteMachineCheck);


module.exports = router;