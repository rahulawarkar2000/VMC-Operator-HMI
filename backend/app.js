require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");

const machineCheckRoutes = require("./routes/machineCheckRoutes");
const toolRoutes = require("./routes/toolRoute");
const workpieceRoutes = require("./routes/workpieceRoute");
const operationRoutes = require("./routes/operationRoute");
const productionRunRoutes = require("./routes/productionRunRoute"); 
const inspectionRoutes  = require("./routes/inspectionRoute");
const dashboardRoutes = require("./routes/dashboardRoute"); 



const app = express();


// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



// Routes
app.use("/api/machine-checks", machineCheckRoutes);
app.use("/api/tools", toolRoutes);
app.use("/api/workpieces", workpieceRoutes);
app.use("/api/operations", operationRoutes);
app.use("/api/production-runs", productionRunRoutes);
app.use("/api/inspections", inspectionRoutes);
app.use("/api/dashboard", dashboardRoutes); 





// Start server
const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        await connectDB();

        app.listen(PORT,"0.0.0.0", () => {
            console.log(`Server is running on port ${PORT}`);
        });

    } catch (error) {
        console.error("Server could not start");
        process.exit(1);
    }
};

startServer();