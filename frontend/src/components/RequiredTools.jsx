import { useEffect, useState } from "react";
import api from "../services/api";

function RequiredTools({ productionRunId, onComplete }) {

    const [tools, setTools] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {

        const fetchTools = async () => {

            if (!productionRunId) {
                setError("Production run is missing");
                setLoading(false);
                return;
            }

            try {
                const response = await api.get(`/production-runs/${productionRunId}/tools`);
                setTools(response.data.data || []);

                const firstUnconfirmedIndex = (response.data.data || []).findIndex((tool) => !tool.confirmed);

                if (firstUnconfirmedIndex === -1) {
                    onComplete();
                } else {
                    setCurrentIndex(firstUnconfirmedIndex);
                }

            } catch (error) {

                console.error("Failed to fetch tools:", error.response?.data || error.message);
                setError(error.response?.data?.message || "Failed to load tools");

            } finally {

                setLoading(false);

            }

        };

        fetchTools();

    }, [productionRunId, onComplete]);

    const handleConfirm = async () => {

        try {

            const currentTool = tools[currentIndex];

            if (!currentTool) {
                setError("No tool available");
                return;
            }

            const response = await api.put(
                `/production-runs/${productionRunId}/tools/${currentTool._id}/confirm`
            );

            const updatedTools = tools.map((tool, index) =>
                index === currentIndex
                    ? response.data.data
                    : tool
            );

            setTools(updatedTools);

            const nextIndex = updatedTools.findIndex(
                (tool, index) =>
                    index > currentIndex && !tool.confirmed
            );

            if (nextIndex !== -1) {
                setCurrentIndex(nextIndex);
            } else {
                onComplete();
            }

        } catch (error) {

            console.error(
                "Failed to confirm tool:",
                error.response?.data || error.message
            );

            setError(
                error.response?.data?.message ||
                "Failed to confirm tool"
            );

        }

    };


    // Loading
    if (loading) {

        return (
            <div className="min-h-screen flex items-center justify-center">

                <h2 className="text-xl font-semibold">
                    Loading Tools...
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


    // No tools
    if (tools.length === 0) {

        return (
            <div className="min-h-screen flex items-center justify-center">

                <h2 className="text-xl font-semibold">
                    No tools found
                </h2>

            </div>
        );

    }


    const currentTool = tools[currentIndex];

    const confirmedCount = tools.filter(
        (tool) => tool.confirmed
    ).length;


    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">

            <div className="w-full max-w-3xl bg-white rounded-2xl shadow-lg p-8">

                {/* Header */}

                <div className="text-center mb-8">

                    <h1 className="text-3xl font-bold">
                        VMC Operator HMI
                    </h1>

                    <p className="text-gray-500 mt-2">
                        Stage 2 of 5 — Required Tools
                    </p>

                </div>


                {/* Progress */}

                <div className="mb-8">

                    <div className="flex justify-between mb-2 text-sm">

                        <span>
                            Tool Progress
                        </span>

                        <span>
                            {confirmedCount} / {tools.length}
                        </span>

                    </div>


                    <div className="w-full bg-gray-200 rounded-full h-3">

                        <div
                            className="bg-green-500 h-3 rounded-full transition-all"
                            style={{
                                width: `${(
                                    confirmedCount / tools.length
                                ) * 100}%`
                            }}
                        />

                    </div>

                </div>


                {/* Current Tool */}

                <div className="border rounded-xl p-8 text-center">

                    <p className="text-gray-500 mb-3">
                        Current Required Tool
                    </p>


                    <h2 className="text-3xl font-bold mb-4">
                        {currentTool.toolNumber}
                    </h2>


                    <p className="text-xl mb-6">
                        {currentTool.toolType}
                    </p>


                    {/* CNC Program */}

                    <div className="bg-gray-50 rounded-lg p-4 mb-6">

                        <p className="text-gray-500 text-sm">
                            CNC Program
                        </p>

                        <p className="font-semibold">
                            {currentTool.cncProgram}
                        </p>


                        <p className="text-gray-500 text-sm mt-3">
                            Program Revision
                        </p>

                        <p className="font-semibold">
                            {currentTool.programRevision}
                        </p>

                    </div>


                    {/* Status */}

                    <div className="mb-6">

                        {currentTool.confirmed ? (

                            <span className="inline-block px-4 py-2 rounded-full bg-green-100 text-green-700">
                                CONFIRMED
                            </span>

                        ) : (

                            <span className="inline-block px-4 py-2 rounded-full bg-yellow-100 text-yellow-700">
                                NOT CONFIRMED
                            </span>

                        )}

                    </div>


                    {/* Confirm */}

                    <button
                        onClick={handleConfirm}
                        disabled={currentTool.confirmed}
                        className="w-full bg-black text-white py-4 rounded-xl text-lg font-semibold hover:bg-gray-800 transition disabled:bg-gray-400"
                    >

                        {currentTool.confirmed
                            ? "Confirmed"
                            : "Insert & Confirm"}

                    </button>

                </div>


                {/* Tool List */}

                <div className="mt-8">

                    <h3 className="font-semibold mb-4">
                        Required Tools
                    </h3>


                    <div className="space-y-3">

                        {tools.map((tool, index) => (

                            <div
                                key={tool._id}
                                className="flex items-center justify-between border rounded-lg p-4"
                            >

                                <div>

                                    <p className="font-semibold">
                                        {tool.toolNumber}
                                    </p>

                                    <p className="text-gray-500">
                                        {tool.toolType}
                                    </p>

                                </div>


                                {tool.confirmed ? (

                                    <span className="text-green-600 font-semibold">
                                        ✓ Confirmed
                                    </span>

                                ) : index === currentIndex ? (

                                    <span className="text-blue-600">
                                        Current
                                    </span>

                                ) : (

                                    <span className="text-gray-400">
                                        Pending
                                    </span>

                                )}

                            </div>

                        ))}

                    </div>

                </div>

            </div>

        </div>
    );
}

export default RequiredTools;