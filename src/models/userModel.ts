import { DataTypes, Model, ModelStatic } from "sequelize";
import { sequelize } from "../db";
import { IUserModel } from "../types/userType";

export const UserModel: ModelStatic<Model<IUserModel>> = sequelize.define(
  "user",
  {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
    },
  }
);

class User {
  async createUser(
    username: string,
    password: string
  ): Promise<Model<IUserModel>> {
    const user = await UserModel.create({ password, username });
    return user;
  }

  async findUserByUsername(
    username: string
  ): Promise<Model<IUserModel> | null> {
    const user = await UserModel.findOne({ where: { username } });
    return user || null;
  }
}

export const UserDbOps = new User();
