import { useState } from "react";

import api from "./services/api";
import MachineChecks from "./components/MachineChecks";
import RequiredTools from "./components/RequiredTools";
import WorkpieceSetup from "./components/WorkpieceSetup";
import ReadyReview from "./components/ReadyReview";
import Operation from "./components/Operation";
import Dashboard from "./components/Dashboard";

function App() {

    const [showDashboard, setShowDashboard] = useState(true);
    const [stage, setStage] = useState(1);
    const [productionRunId, setProductionRunId] = useState(null);

    const handleStartProduction = async () => {
        try {
            const [workpiecesResponse, toolsResponse, operationsResponse, runsResponse] = await Promise.all([
                api.get("/workpieces").catch(() => ({ data: { data: [] } })),
                api.get("/tools").catch(() => ({ data: { data: [] } })),
                api.get("/operations").catch(() => ({ data: { data: [] } })),
                api.get("/production-runs").catch(() => ({ data: { data: [] } }))
            ]);

            const workpieces = workpiecesResponse.data.data || [];
            const tools = toolsResponse.data.data || [];
            const operations = operationsResponse.data.data || [];
            const runs = runsResponse.data.data || [];

            const activeRun = runs.find((run) => ["planned", "running", "paused"].includes(run.status));

            if (activeRun && activeRun._id) {
                setProductionRunId(activeRun._id);
                setShowDashboard(false);
                setStage(1);
                return;
            }

            let workpieceId = workpieces[0]?._id;
            if (!workpieceId) {
                const createdWorkpiece = await api.post("/workpieces", {
                    partNumber: "P-DEFAULT",
                    partName: "Default Part",
                    material: "Aluminum",
                    quantity: 1
                });
                workpieceId = createdWorkpiece.data.data._id;
            }

            let operationId = operations[0]?._id;
            if (!operationId) {
                let toolId = tools[0]?._id;
                if (!toolId) {
                    const createdTool = await api.post("/tools", {
                        toolNumber: "T-DEFAULT",
                        toolType: "End Mill",
                        cncProgram: "DEFAULT-PROG",
                        programRevision: "REV-00"
                    });
                    toolId = createdTool.data.data._id;
                }

                const createdOperation = await api.post("/operations", {
                    operationNumber: 1,
                    operationName: "Default Operation",
                    workpiece: workpieceId,
                    tool: toolId,
                    cncProgram: "DEFAULT-PROG",
                    spindleSpeed: 1200,
                    feedRate: 250,
                    operationTime: 30,
                    status: "pending"
                });
                operationId = createdOperation.data.data._id;
            }

            const response = await api.post("/production-runs", {
                workpiece: workpieceId,
                operation: operationId,
                machineNumber: "VMC-01",
                plannedQuantity: 1,
                producedQuantity: 0,
                rejectedQuantity: 0,
                status: "running"
            });

            const runId = response?.data?.data?._id;

            if (!runId) {
                throw new Error("Production run id missing from response");
            }

            setProductionRunId(runId);
            setShowDashboard(false);
            setStage(1);
        } catch (error) {
            console.error("Failed to start production:", error.response?.data || error.message);
            alert(error.response?.data?.message || "Failed to start production");
        }
    };

    if (showDashboard) {
        return (
            <Dashboard
                onStart={handleStartProduction}
            />
        );
    }

    if (!productionRunId) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <h1 className="text-xl font-semibold text-red-600">
                    Production run not available.
                </h1>
            </div>
        );
    }

    return (
        <>
            {stage === 1 && (
                <MachineChecks
                    productionRunId={productionRunId}
                    onComplete={() => setStage(2)}
                />
            )}

            {stage === 2 && (
                <RequiredTools
                    productionRunId={productionRunId}
                    onComplete={() => setStage(3)}
                />
            )}

            {stage === 3 && (
                <WorkpieceSetup
                    productionRunId={productionRunId}
                    onComplete={() => setStage(4)}
                />
            )}

            {stage === 4 && (
                <ReadyReview
                    productionRunId={productionRunId}
                    onComplete={() => setStage(5)}
                />
            )}

            {stage === 5 && (
                <Operation
                    productionRunId={productionRunId}
                    onComplete={() => setStage(6)}
                />
            )}

            {stage === 6 && (
                <div className="min-h-screen flex items-center justify-center">
                    <h1 className="text-3xl font-bold">
                        Production Complete
                    </h1>
                </div>
            )}
        </>
    );
}

export default App;