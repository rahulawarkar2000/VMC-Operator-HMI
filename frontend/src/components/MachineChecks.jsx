import { useEffect, useState } from "react";
import api from "../services/api";

function MachineChecks({ productionRunId, onComplete }) {

    const [checks, setChecks] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {

        const fetchChecks = async () => {

            if (!productionRunId) {
                setError("Production run is missing");
                setLoading(false);
                return;
            }

            try {
                const response = await api.get(`/production-runs/${productionRunId}/machine-checks`);
                const data = response.data.data || [];

                setChecks(data);

                const firstUnconfirmedIndex = data.findIndex((check) => !check.confirmed);

                if (firstUnconfirmedIndex === -1) {
                    onComplete();
                } else {
                    setCurrentIndex(firstUnconfirmedIndex);
                }

            } catch (error) {

                console.error(
                    "Failed to fetch machine checks:",
                    error.response?.data || error.message
                );

                setError(error.response?.data?.message || "Failed to load machine checks");

            } finally {

                setLoading(false);

            }

        };

        fetchChecks();

    }, [productionRunId, onComplete]);

    const handleConfirm = async () => {

        try {

            const currentCheck = checks[currentIndex];

            if (!currentCheck) {
                setError("No machine check available");
                return;
            }

            const response = await api.put(
                `/production-runs/${productionRunId}/machine-checks/${currentCheck._id}/confirm`
            );

            setChecks((previousChecks) =>
                previousChecks.map((check, index) =>
                    index === currentIndex
                        ? response.data.data
                        : check
                )
            );

            const nextIndex = checks.findIndex(
                (check, index) =>
                    index > currentIndex && !check.confirmed
            );

            if (nextIndex !== -1) {
                setCurrentIndex(nextIndex);
            } else {
                const remaining = checks.some((check, index) => index !== currentIndex && !check.confirmed);
                if (!remaining) {
                    onComplete();
                }
            }

        } catch (error) {

            console.error(
                "Failed to confirm machine check:",
                error.response?.data || error.message
            );

            setError(
                error.response?.data?.message ||
                "Failed to confirm machine check"
            );

        }

    };


    // Loading
    if (loading) {

        return (
            <div className="min-h-screen flex items-center justify-center">

                <h2 className="text-xl font-semibold">
                    Loading Machine Checks...
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


    // No checks
    if (checks.length === 0) {

        return (
            <div className="min-h-screen flex items-center justify-center">

                <h2 className="text-xl font-semibold">
                    No machine checks found
                </h2>

            </div>
        );

    }


    const currentCheck =
        checks[currentIndex];


    const confirmedCount =
        checks.filter(
            (check) => check.confirmed
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
                        Stage 1 of 5 — Machine Checks
                    </p>

                </div>


                {/* Progress */}

                <div className="mb-8">

                    <div className="flex justify-between text-sm mb-2">

                        <span>
                            Machine Checks
                        </span>

                        <span>
                            {confirmedCount} / {checks.length}
                        </span>

                    </div>


                    <div className="w-full bg-gray-200 rounded-full h-3">

                        <div
                            className="bg-green-500 h-3 rounded-full transition-all"
                            style={{
                                width: `${(
                                    confirmedCount /
                                    checks.length
                                ) * 100}%`
                            }}
                        />

                    </div>

                </div>


                {/* Current Check */}

                <div className="border rounded-xl p-8 text-center">

                    <p className="text-gray-500 mb-3">
                        Current Machine Check
                    </p>


                    <h2 className="text-2xl font-semibold mb-6">
                        {currentCheck.name}
                    </h2>


                    {/* Status */}

                    <div className="mb-6">

                        {currentCheck.confirmed ? (

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
                        disabled={currentCheck.confirmed}
                        className="w-full bg-black text-white py-4 rounded-xl text-lg font-semibold hover:bg-gray-800 transition disabled:bg-gray-400"
                    >

                        {currentCheck.confirmed
                            ? "Confirmed"
                            : "Confirm Check"}

                    </button>

                </div>


                {/* Checklist */}

                <div className="mt-8">

                    <h3 className="font-semibold mb-4">
                        Checklist
                    </h3>


                    <div className="space-y-3">

                        {checks.map((check, index) => (

                            <div
                                key={check._id}
                                className="flex items-center justify-between border rounded-lg p-4"
                            >

                                <span>
                                    {check.name}
                                </span>


                                {check.confirmed ? (

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

export default MachineChecks;