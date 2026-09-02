import { useEffect, useState } from "react";
import api from "../services/api";

function WorkpieceSetup({ productionRunId, onComplete }) {

    const [workpieces, setWorkpieces] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {

        const fetchWorkpieces = async () => {

            if (!productionRunId) {
                setError("Production run is missing");
                setLoading(false);
                return;
            }

            try {
                const response = await api.get(`/production-runs/${productionRunId}/workpieces`);
                const data = response.data.data || [];

                setWorkpieces(data);

                const firstUnconfirmedIndex = data.findIndex((workpiece) => !workpiece.confirmed);

                if (firstUnconfirmedIndex === -1) {
                    onComplete();
                } else {
                    setCurrentIndex(firstUnconfirmedIndex);
                }

            } catch (error) {

                console.error(
                    "Failed to fetch workpieces:",
                    error.response?.data || error.message
                );

                setError(error.response?.data?.message || "Failed to load workpieces");

            } finally {

                setLoading(false);

            }

        };

        fetchWorkpieces();

    }, [productionRunId, onComplete]);

    const handleConfirm = async () => {

        try {

            const currentWorkpiece = workpieces[currentIndex];

            if (!currentWorkpiece) {
                setError("No workpiece available");
                return;
            }

            const response = await api.put(
                `/production-runs/${productionRunId}/workpieces/${currentWorkpiece._id}/confirm`
            );

            setWorkpieces((previousWorkpieces) =>
                previousWorkpieces.map(
                    (workpiece, index) =>
                        index === currentIndex
                            ? response.data.data
                            : workpiece
                )
            );

            const nextIndex = workpieces.findIndex(
                (workpiece, index) =>
                    index > currentIndex && !workpiece.confirmed
            );

            if (nextIndex !== -1) {
                setCurrentIndex(nextIndex);
            } else {
                onComplete();
            }

        } catch (error) {

            console.error(
                "Failed to confirm workpiece:",
                error.response?.data || error.message
            );

            setError(
                error.response?.data?.message ||
                "Failed to confirm workpiece"
            );

        }

    };


    // Loading
    if (loading) {

        return (
            <div className="min-h-screen flex items-center justify-center">

                <h2 className="text-xl font-semibold">
                    Loading Workpieces...
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


    // No workpieces
    if (workpieces.length === 0) {

        return (
            <div className="min-h-screen flex items-center justify-center">

                <h2 className="text-xl font-semibold">
                    No workpieces found
                </h2>

            </div>
        );

    }


    const currentWorkpiece =
        workpieces[currentIndex];


    const confirmedCount =
        workpieces.filter(
            (workpiece) => workpiece.confirmed
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
                        Stage 3 of 5 — Workpiece Setup
                    </p>

                </div>


                {/* Progress */}

                <div className="mb-8">

                    <div className="flex justify-between text-sm mb-2">

                        <span>
                            Workpiece Progress
                        </span>

                        <span>
                            {confirmedCount} / {workpieces.length}
                        </span>

                    </div>


                    <div className="w-full bg-gray-200 rounded-full h-3">

                        <div
                            className="bg-green-500 h-3 rounded-full transition-all"
                            style={{
                                width: `${(
                                    confirmedCount /
                                    workpieces.length
                                ) * 100}%`
                            }}
                        />

                    </div>

                </div>


                {/* Workpiece Information */}

                <div className="border rounded-xl p-6">

                    <h2 className="text-xl font-semibold mb-6">
                        Workpiece Information
                    </h2>


                    {/* Part Number */}

                    <div className="border-b py-4">

                        <p className="text-sm text-gray-500">
                            Part Number
                        </p>

                        <p className="font-semibold text-lg">
                            {currentWorkpiece.partNumber}
                        </p>

                    </div>


                    {/* Part Name */}

                    <div className="border-b py-4">

                        <p className="text-sm text-gray-500">
                            Part Name
                        </p>

                        <p className="font-semibold text-lg">
                            {currentWorkpiece.partName}
                        </p>

                    </div>


                    {/* Material */}

                    <div className="border-b py-4">

                        <p className="text-sm text-gray-500">
                            Material
                        </p>

                        <p className="font-semibold text-lg">
                            {currentWorkpiece.material}
                        </p>

                    </div>


                    {/* Quantity */}

                    <div className="py-4">

                        <p className="text-sm text-gray-500">
                            Quantity
                        </p>

                        <p className="font-semibold text-lg">
                            {currentWorkpiece.quantity}
                        </p>

                    </div>

                </div>


                {/* Status */}

                <div className="text-center mt-8">

                    {currentWorkpiece.confirmed ? (

                        <div className="text-green-600 font-semibold text-lg">
                            ✓ Workpiece Setup Confirmed
                        </div>

                    ) : (

                        <div className="bg-yellow-100 text-yellow-700 inline-block px-4 py-2 rounded-full">
                            Setup Not Confirmed
                        </div>

                    )}

                </div>


                {/* Confirm Button */}

                <button
                    onClick={handleConfirm}
                    disabled={currentWorkpiece.confirmed}
                    className="w-full mt-6 bg-black text-white py-4 rounded-xl text-lg font-semibold hover:bg-gray-800 transition disabled:bg-gray-400"
                >

                    {currentWorkpiece.confirmed
                        ? "Confirmed"
                        : "Confirm Workpiece Setup"}

                </button>


                {/* Workpiece List */}

                <div className="mt-8">

                    <h3 className="font-semibold mb-4">
                        Workpieces
                    </h3>


                    <div className="space-y-3">

                        {workpieces.map(
                            (workpiece, index) => (

                                <div
                                    key={workpiece._id}
                                    className="flex items-center justify-between border rounded-lg p-4"
                                >

                                    <div>

                                        <p className="font-semibold">
                                            {workpiece.partNumber}
                                        </p>

                                        <p className="text-gray-500">
                                            {workpiece.partName}
                                        </p>

                                    </div>


                                    {workpiece.confirmed ? (

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

                            )
                        )}

                    </div>

                </div>

            </div>

        </div>
    );
}

export default WorkpieceSetup;