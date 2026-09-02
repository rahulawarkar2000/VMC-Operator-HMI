const express = require("express");

const router = express.Router();

const {
    createProductionRun,
    getAllProductionRuns,
    getProductionRunById,
    updateProductionRun,
    deleteProductionRun,
    updateProductionStatus,
    getProductionRunMachineChecks,
    confirmProductionRunMachineCheck,
    getProductionRunTools,
    confirmProductionRunTool,
    getProductionRunWorkpieces,
    confirmProductionRunWorkpiece,
    getProductionRunReadiness
} = require("../controllers/productionRunController");


router.post("/", createProductionRun);

router.get("/", getAllProductionRuns);

router.get("/:id/machine-checks", getProductionRunMachineChecks);

router.put("/:id/machine-checks/:checkId/confirm", confirmProductionRunMachineCheck);

router.get("/:id/tools", getProductionRunTools);

router.put("/:id/tools/:toolId/confirm", confirmProductionRunTool);

router.get("/:id/workpieces", getProductionRunWorkpieces);

router.put("/:id/workpieces/:workpieceId/confirm", confirmProductionRunWorkpiece);

router.get("/:id/readiness", getProductionRunReadiness);

router.get("/:id", getProductionRunById);

router.put("/:id", updateProductionRun);

router.delete("/:id", deleteProductionRun);

router.patch("/:id/status", updateProductionStatus);


module.exports = router;