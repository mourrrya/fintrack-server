require("dotenv").config();
import cors from "cors";
import express from "express";
import { sequelize } from "./db";
import { errorHandlerMiddleware } from "./middlewares/errorHandlerMiddleware";
import { router } from "./routers/routers";

const app = express();

app.use(express.json());

const port = process.env.PORT || 5000;

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

app.use("/", router);

app.use(errorHandlerMiddleware);

const start = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
