import { Sequelize } from "sequelize";

export const sequelize = new Sequelize(
  process.env.DB_NAME || "",
  process.env.DB_USER || "",
  process.env.DB_PASS || "",
  {
    dialect: "postgres",
    port: Number(process.env.DB_PORT),
    host: process.env.DB_HOST,
  }
);

