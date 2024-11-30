import routes from "./routes/donorRoutes.js";

const donorModule = (app) => {
  app.use("/api/v1/donor", routes);
};

export default donorModule;
