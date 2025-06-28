import vendorRoutes from "./routes/vendorRoutes.js";

const vendorModule = (app) => {
  app.use("/api/v1/vendor", vendorRoutes);
};

export default vendorModule;
