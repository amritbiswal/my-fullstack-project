require("dotenv").config();

const validateEnv = require("./config/env");
validateEnv(process.env);

const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const { applySecurity } = require("./config/security");
const correlationIdMiddleware = require("./middlewares/logging.middleware");
const errorHandler = require("./error-handling/errorHandler");

// Connect to the database
require("./db");

const app = express();

// Security and core middlewares
applySecurity(app);

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(correlationIdMiddleware);

// Routes
const indexRoutes = require("./routes/index.routes");
app.use("/api", indexRoutes);

const authRoutes = require("./modules/auth/auth.routes");
app.use("/api/auth", authRoutes);

const providerRoutes = require("./routes/provider.routes");
app.use("/api/provider", providerRoutes);

const partnerRoutes = require("./routes/partner.routes");
app.use("/api/partner", partnerRoutes);

const staffRoutes = require("./routes/staff.routes");
app.use("/api/staff", staffRoutes);

const catalogRoutes = require("./routes/catalog.routes");
app.use("/api/catalog", catalogRoutes);

const bookingRoutes = require("./routes/booking.routes");
app.use("/api/booking", bookingRoutes);

const sourcingRoutes = require("./routes/sourcing.routes");
app.use("/api/sourcing", sourcingRoutes);

const publicRoutes = require("./routes/public.routes");
app.use("/api/public", publicRoutes);

const adminRoutes = require("./routes/admin.routes");
app.use("/api/admin", adminRoutes);

// Error handler
app.use(errorHandler);

module.exports = app;
