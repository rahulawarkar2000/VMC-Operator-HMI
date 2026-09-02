import { useEffect, useState } from "react";
import api from "../services/api";

function Operation({ productionRunId, onComplete }) {

    const [operations, setOperations] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {

        const fetchOperations = async () => {

            if (!productionRunId) {
                setError("Production run is missing");
                setLoading(false);
                return;
            }

            try {
                const response = await api.get("/operations");
                const operationData = response.data.data || [];
                setOperations(operationData);

                if (operationData.length === 0) {
                    setError("No operations found");
                }

            } catch (error) {

                console.error(
                    "Failed to fetch operations:",
                    error.response?.data || error.message
                );

                setError(error.response?.data?.message || "Failed to load operations");

            } finally {

                setLoading(false);

            }

        };

        fetchOperations();

    }, [productionRunId]);

    const handleStart = async () => {

        try {
            const currentOperation = operations[currentIndex];

            if (!currentOperation) {
                setError("No operation available");
                return;
            }

            const response = await api.patch(
                `/operations/${currentOperation._id}/status`,
                { status: "running" }
            );

            setOperations((previousOperations) =>
                previousOperations.map((operation, index) =>
                    index === currentIndex ? response.data.data : operation
                )
            );

        } catch (error) {
            console.error(
                "Failed to start operation:",
                error.response?.data || error.message
            );

            setError(error.response?.data?.message || "Failed to start operation");
        }

    };

    const handleStop = async () => {

        try {
            const currentOperation = operations[currentIndex];

            const response = await api.patch(
                `/operations/${currentOperation._id}/status`,
                { status: "failed" }
            );

            setOperations((previousOperations) =>
                previousOperations.map((operation, index) =>
                    index === currentIndex ? response.data.data : operation
                )
            );

        } catch (error) {
            console.error(
                "Failed to stop operation:",
                error.response?.data || error.message
            );

            setError(error.response?.data?.message || "Failed to stop operation");
        }

    };

    const handleComplete = async () => {
        try {
            const currentOperation = operations[currentIndex];

            if (!currentOperation) {
                setError("No operation available");
                return;
            }

            const response = await api.patch(
                `/operations/${currentOperation._id}/status`,
                { status: "completed" }
            );

            setOperations((previousOperations) =>
                previousOperations.map((operation, index) =>
                    index === currentIndex ? response.data.data : operation
                )
            );

            await api.patch(`/production-runs/${productionRunId}/status`, {
                status: "completed",
                producedQuantity: 1,
                rejectedQuantity: 0
            });

            onComplete();
        } catch (error) {
            console.error("Failed to complete operation:", error.response?.data || error.message);
            setError(error.response?.data?.message || "Failed to complete operation");
        }
    };


    // Loading
    if (loading) {

        return (
            <div className="min-h-screen flex items-center justify-center">

                <h2 className="text-xl font-semibold">
                    Loading Operations...
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


    // No operations
    if (operations.length === 0) {

        return (
            <div className="min-h-screen flex items-center justify-center">

                <h2 className="text-xl font-semibold">
                    No operations found
                </h2>

            </div>
        );

    }


    const currentOperation =
        operations[currentIndex];


    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">

            <div className="w-full max-w-3xl bg-white rounded-2xl shadow-lg p-8">


                {/* Header */}

                <div className="text-center mb-8">

                    <h1 className="text-3xl font-bold">
                        VMC Operator HMI
                    </h1>

                    <p className="text-gray-500 mt-2">
                        Stage 5 of 5 — Operation
                    </p>

                </div>


                {/* Progress */}

                <div className="mb-8">

                    <div className="flex justify-between text-sm mb-2">

                        <span>
                            Operation Progress
                        </span>

                        <span>
                            {currentIndex + 1} / {operations.length}
                        </span>

                    </div>


                    <div className="w-full bg-gray-200 rounded-full h-3">

                        <div
                            className="bg-green-500 h-3 rounded-full transition-all"
                            style={{
                                width: `${(
                                    ((currentIndex + 1) /
                                        operations.length) *
                                    100
                                )}%`
                            }}
                        />

                    </div>

                </div>


                {/* Operation */}

                <div className="border rounded-xl p-8 text-center">

                    <p className="text-gray-500 mb-3">
                        Operation
                    </p>


                    <h2 className="text-3xl font-bold mb-4">

                        Operation #{currentOperation.operationNumber}

                    </h2>


                    <p className="text-xl mb-8">

                        {currentOperation.operationName}

                    </p>


                    {/* Status */}

                    <div className="mb-8">

                        <p className="text-gray-500 mb-3">
                            Current Status
                        </p>


                        <span className="inline-block px-6 py-3 rounded-full bg-gray-100 text-xl font-bold">

                            {currentOperation.status.toUpperCase()}

                        </span>

                    </div>


                    {/* Buttons */}

                    {currentOperation.status === "pending" && (

                        <button
                            onClick={handleStart}
                            className="w-full bg-black text-white py-4 rounded-xl text-lg font-semibold hover:bg-gray-800 transition"
                        >
                            Start Operation
                        </button>

                    )}


                    {currentOperation.status === "running" && (

                        <button
                            onClick={handleStop}
                            className="w-full bg-red-600 text-white py-4 rounded-xl text-lg font-semibold hover:bg-red-700 transition"
                        >
                            Stop Operation
                        </button>

                    )}


                    {currentOperation.status === "failed" && (

                        <button
                            onClick={handleStart}
                            className="w-full bg-black text-white py-4 rounded-xl text-lg font-semibold hover:bg-gray-800 transition"
                        >
                            Start Operation Again
                        </button>

                    )}

                </div>


                {/* Operation Information */}

                <div className="mt-8 border rounded-xl p-6">

                    <h3 className="font-semibold mb-4">
                        Operation Information
                    </h3>


                    <div className="space-y-3">


                        <div className="flex justify-between">

                            <span className="text-gray-500">
                                Operation
                            </span>

                            <span className="font-semibold">
                                {currentOperation.operationName}
                            </span>

                        </div>


                        <div className="flex justify-between">

                            <span className="text-gray-500">
                                CNC Program
                            </span>

                            <span className="font-semibold">
                                {currentOperation.cncProgram}
                            </span>

                        </div>


                        <div className="flex justify-between">

                            <span className="text-gray-500">
                                Spindle Speed
                            </span>

                            <span className="font-semibold">
                                {currentOperation.spindleSpeed} RPM
                            </span>

                        </div>


                        <div className="flex justify-between">

                            <span className="text-gray-500">
                                Feed Rate
                            </span>

                            <span className="font-semibold">
                                {currentOperation.feedRate}
                            </span>

                        </div>


                        <div className="flex justify-between">

                            <span className="text-gray-500">
                                Operation Time
                            </span>

                            <span className="font-semibold">
                                {currentOperation.operationTime} min
                            </span>

                        </div>


                    </div>

                </div>


                {/* Next Operation */}

                {currentOperation.status === "failed" &&
                    currentIndex < operations.length - 1 && (

                        <button
                            onClick={() =>
                                setCurrentIndex(currentIndex + 1)
                            }
                            className="w-full mt-6 border border-black py-4 rounded-xl text-lg font-semibold hover:bg-gray-100"
                        >
                            Next Operation
                        </button>

                    )}

            </div>

        </div>
    );

}

export default Operation;