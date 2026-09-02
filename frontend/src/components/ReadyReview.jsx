import { useEffect, useState } from "react";
import api from "../services/api";

function ReadyReview({ productionRunId, onComplete }) {

    const [machineChecks, setMachineChecks] = useState([]);
    const [tools, setTools] = useState([]);
    const [workpieces, setWorkpieces] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {

        const fetchSetupStatus = async () => {

            if (!productionRunId) {
                setError("Production run is missing");
                setLoading(false);
                return;
            }

            try {

                const [
                    machineResponse,
                    toolsResponse,
                    workpieceResponse
                ] = await Promise.all([
                    api.get(`/production-runs/${productionRunId}/machine-checks`),
                    api.get(`/production-runs/${productionRunId}/tools`),
                    api.get(`/production-runs/${productionRunId}/workpieces`)
                ]);

                setMachineChecks(machineResponse.data.data || []);
                setTools(toolsResponse.data.data || []);
                setWorkpieces(workpieceResponse.data.data || []);

            } catch (error) {

                console.error(
                    "Failed to fetch setup status:",
                    error.response?.data || error.message
                );

                setError(error.response?.data?.message || "Failed to load setup status");

            } finally {

                setLoading(false);

            }

        };

        fetchSetupStatus();

    }, [productionRunId]);

    const machineChecksCompleted =
        machineChecks.length > 0 &&
        machineChecks.every((check) => check.confirmed === true);

    const toolsCompleted =
        tools.length > 0 &&
        tools.every((tool) => tool.confirmed === true);

    const workpiecesCompleted =
        workpieces.length > 0 &&
        workpieces.every((workpiece) => workpiece.confirmed === true);

    const allCompleted =
        machineChecksCompleted &&
        toolsCompleted &&
        workpiecesCompleted;


    // Checklist
    const checklist = [

        {
            name: "Machine Checks",
            completed: machineChecksCompleted
        },

        {
            name: "Required Tools",
            completed: toolsCompleted
        },

        {
            name: "Workpiece Setup",
            completed: workpiecesCompleted
        }

    ];


    // Loading
    if (loading) {

        return (
            <div className="min-h-screen flex items-center justify-center">

                <h2 className="text-xl font-semibold">
                    Checking Production Readiness...
                </h2>

            </div>
        );

    }


    // Error
    if (error) {

        return (
            <div className="min-h-screen flex items-center justify-center">

                <h2 className="text-red-600 font-semibold">
                    {error}
                </h2>

            </div>
        );

    }


    return (

        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">

            <div className="w-full max-w-3xl bg-white rounded-2xl shadow-lg p-8">


                {/* Header */}

                <div className="text-center mb-8">

                    <h1 className="text-3xl font-bold">
                        VMC Operator HMI
                    </h1>

                    <p className="text-gray-500 mt-2">
                        Stage 4 of 5 — Ready Review
                    </p>

                </div>


                {/* Progress */}

                <div className="mb-8">

                    <div className="flex justify-between text-sm mb-2">

                        <span>
                            Overall Progress
                        </span>

                        <span>
                            4 / 5
                        </span>

                    </div>


                    <div className="w-full bg-gray-200 rounded-full h-3">

                        <div
                            className="bg-green-500 h-3 rounded-full transition-all"
                            style={{
                                width: allCompleted
                                    ? "80%"
                                    : "60%"
                            }}
                        />

                    </div>

                </div>


                {/* Ready Status */}

                <div className="text-center border rounded-xl p-8 mb-8">

                    {allCompleted ? (

                        <>

                            <div className="text-6xl mb-4">
                                ✓
                            </div>

                            <h2 className="text-3xl font-bold text-green-600">
                                READY
                            </h2>

                            <p className="text-gray-500 mt-2">
                                All required setup steps are completed.
                            </p>

                        </>

                    ) : (

                        <>

                            <div className="text-6xl mb-4">
                                !
                            </div>

                            <h2 className="text-3xl font-bold text-red-600">
                                NOT READY
                            </h2>

                            <p className="text-gray-500 mt-2">
                                Please complete all required setup steps.
                            </p>

                        </>

                    )}

                </div>


                {/* Checklist */}

                <div>

                    <h2 className="text-xl font-semibold mb-4">
                        Setup Checklist
                    </h2>

                    {allCompleted && (
                        <button
                            onClick={onComplete}
                            className="w-full bg-black text-white py-4 rounded-xl text-lg font-semibold hover:bg-gray-800 transition mb-6"
                        >
                            Continue to Operation
                        </button>
                    )}


                    <div className="space-y-3">

                        {checklist.map((item) => (

                            <div
                                key={item.name}
                                className="flex items-center justify-between border rounded-xl p-4"
                            >

                                <div>

                                    <p className="font-semibold">
                                        {item.name}
                                    </p>

                                </div>


                                {item.completed ? (

                                    <span className="text-green-600 font-semibold">
                                        ✓ Completed
                                    </span>

                                ) : (

                                    <span className="text-red-600 font-semibold">
                                        ✕ Pending
                                    </span>

                                )}

                            </div>

                        ))}

                    </div>

                </div>


                {/* Proceed Button */}

                <button
                    onClick={onComplete}
                    disabled={!allCompleted}
                    className="w-full mt-8 bg-black text-white py-4 rounded-xl text-lg font-semibold hover:bg-gray-800 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                >

                    {allCompleted
                        ? "Proceed to Operation"
                        : "Complete Setup First"}

                </button>


            </div>

        </div>

    );

}

export default ReadyReview;