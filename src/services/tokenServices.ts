import jwt from "jsonwebtoken";
import { UserDto } from "../dtos/userDto";
import { TokenDbOps } from "../models/tokenModel";
import { ApiError } from "../errors/apiErrors";
class TokenSer {
  generateToken(userDto: UserDto) {
    try {
      const accessToken = jwt.sign(
        { ...userDto },
        process.env.JWT_ACCESS_TOKEN as string,
        {
          expiresIn: "1h",
        }
      );
      const refreshToken = jwt.sign(
        { ...userDto },
        process.env.JWT_REFRESH_TOKEN as string,
        {
          expiresIn: "30d",
        }
      );

      return {
        accessToken,
        refreshToken,
      };
    } catch (error) {
      throw ApiError.internal("Token generation failed");
    }
  }

  async saveToken(userDto: UserDto, refreshToken: string) {
    try {
      const tokenFound = await TokenDbOps.findTokenByUserId(userDto);
      if (tokenFound) {
        tokenFound.set({ refreshToken: refreshToken });
        tokenFound.save();
      }
      const token = await TokenDbOps.createToken(userDto, refreshToken);
      return token;
    } catch (error) {
      throw ApiError.internal("token save failed");
    }
  }

  validateAccessToken(accessToken: string) {
    try {
      const userDto = jwt.verify(
        accessToken,
        process.env.JWT_ACCESS_TOKEN as string
      );
      return userDto;
    } catch (error) {
      throw ApiError.internal("Access token validation failed");
    }
  }

  validateRefreshToken(refreshToken: string) {
    try {
      const userDto = jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_TOKEN as string
      );
      return userDto;
    } catch (error) {
      throw ApiError.internal("Access token validation failed");
    }
  }
}

export const TokenService = new TokenSer();
