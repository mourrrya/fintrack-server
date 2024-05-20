import { DataTypes, Model, ModelStatic } from "sequelize";
import { sequelize } from "../db";
import { UserModel } from "./userModel";
import { UserDto } from "../dtos/userDto";
import { ITokenModel } from "../types/tokenType";

export const TokenModel: ModelStatic<Model<ITokenModel>> = sequelize.define(
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
    accessToken: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }
);

class Token {
  async createToken(
    userDto: UserDto,
    refreshToken: string,
    accessToken: string
  ): Promise<Model<ITokenModel>> {
    const token = await TokenModel.create({
      userId: userDto.id,
      refreshToken,
      accessToken,
    });
    return token;
  }

  async findTokenByUserId(
    userDto: UserDto
  ): Promise<Model<ITokenModel> | null> {
    const token = await TokenModel.findOne({ where: { userId: userDto.id } });
    return token || null;
  }
}

export const TokenDbOps = new Token();
