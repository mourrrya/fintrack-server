import { DataTypes, Model, ModelStatic } from "sequelize";
import { sequelize } from "../db";
import { UserModel } from "./userModel";
import { UserDto } from "../dtos/userDto";
import { TokenModelI } from "../interfaces/tokenInterface";

export const TokenModel: ModelStatic<Model<TokenModelI>> = sequelize.define(
  "token",
  {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: UserModel,
        key: "id",
      },
    },
    refreshToken: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }
);

class Token {
  async createToken(
    userDto: UserDto,
    refreshToken: string
  ): Promise<Model<TokenModelI>> {
    const token = await TokenModel.create({ userId: userDto.id, refreshToken });
    return token;
  }

  async findTokenByUserId(
    userDto: UserDto
  ): Promise<Model<TokenModelI> | null> {
    const token = await TokenModel.findOne({ where: { userId: userDto.id } });
    return token || null;
  }
}

export const TokenDbOps = new Token();
