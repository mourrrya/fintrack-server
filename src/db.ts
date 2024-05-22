import { Sequelize } from "sequelize";

console.log("process.env.DB_NAME", process.env.DB_NAME);
console.log("process.env.DB_USER", process.env.DB_USER);
console.log("process.env.DB_PASS", process.env.DB_PASS);
console.log("process.env.DB_PORT", process.env.DB_PORT);
console.log("process.env.DB_HOST", process.env.DB_HOST);


export const sequelize = new Sequelize(
  process.env.DB_NAME!,
  process.env.DB_USER!,
  process.env.DB_PASS!,
  {
    dialect: "postgres",
    port: Number(process.env.DB_PORT),
    host: process.env.DB_HOST,
  }
);

