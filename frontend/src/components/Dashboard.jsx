import { useEffect, useState } from "react";
import api from "../services/api";

function Dashboard({ onStart }) {

    const [dashboard, setDashboard] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchDashboard = async () => {
        try {
            const response = await api.get("/dashboard/summary");

            setDashboard(response.data.data);
        } catch (error) {
            console.error(error);
            setError("Failed to load dashboard");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboard();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <h1 className="text-xl font-semibold">
                    Loading Dashboard...
                </h1>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <h1 className="text-red-600">
                    {error}
                </h1>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 p-6">

            {/* Header */}

            <div className="flex items-center justify-between mb-8">

                <div>
                    <h1 className="text-3xl font-bold">
                        VMC Operator HMI
                    </h1>

                    <p className="text-gray-500 mt-1">
                        Production Dashboard
                    </p>
                </div>

                <button
                    onClick={onStart}
                    className="bg-black text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800"
                >
                    Start Production
                </button>

            </div>


            {/* Summary Cards */}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">

                <div className="bg-white rounded-xl shadow p-6">
                    <p className="text-gray-500">
                        Total Tools
                    </p>

                    <h2 className="text-3xl font-bold mt-2">
                        {dashboard.tools.total}
                    </h2>
                </div>


                <div className="bg-white rounded-xl shadow p-6">
                    <p className="text-gray-500">
                        Total Workpieces
                    </p>

                    <h2 className="text-3xl font-bold mt-2">
                        {dashboard.workpieces.total}
                    </h2>
                </div>


                <div className="bg-white rounded-xl shadow p-6">
                    <p className="text-gray-500">
                        Total Operations
                    </p>

                    <h2 className="text-3xl font-bold mt-2">
                        {dashboard.operations.total}
                    </h2>
                </div>

            </div>


            {/* Production */}

            <div className="bg-white rounded-xl shadow p-6 mb-6">

                <h2 className="text-xl font-bold mb-6">
                    Production Summary
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                    <div>
                        <p className="text-gray-500">
                            Planned
                        </p>

                        <p className="text-3xl font-bold">
                            {dashboard.production.planned}
                        </p>
                    </div>


                    <div>
                        <p className="text-gray-500">
                            Produced
                        </p>

                        <p className="text-3xl font-bold">
                            {dashboard.production.produced}
                        </p>
                    </div>


                    <div>
                        <p className="text-gray-500">
                            Rejected
                        </p>

                        <p className="text-3xl font-bold">
                            {dashboard.production.rejected}
                        </p>
                    </div>

                </div>

            </div>


            {/* Production Runs + Inspection */}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Production Runs */}

                <div className="bg-white rounded-xl shadow p-6">

                    <h2 className="text-xl font-bold mb-6">
                        Production Runs
                    </h2>

                    <div className="space-y-4">

                        <div className="flex justify-between">
                            <span>Total</span>
                            <b>{dashboard.productionRuns.total}</b>
                        </div>

                        <div className="flex justify-between">
                            <span>Running</span>
                            <b>{dashboard.productionRuns.running}</b>
                        </div>

                        <div className="flex justify-between">
                            <span>Completed</span>
                            <b>{dashboard.productionRuns.completed}</b>
                        </div>

                        <div className="flex justify-between">
                            <span>Failed</span>
                            <b>{dashboard.productionRuns.failed}</b>
                        </div>

                    </div>

                </div>


                {/* Inspection */}

                <div className="bg-white rounded-xl shadow p-6">

                    <h2 className="text-xl font-bold mb-6">
                        Inspection

                    </h2>

                    <div className="space-y-4">

                        <div className="flex justify-between">
                            <span>Passed</span>
                            <b>{dashboard.inspection.passed}</b>
                        </div>

                        <div className="flex justify-between">
                            <span>Failed</span>
                            <b>{dashboard.inspection.failed}</b>
                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default Dashboard;