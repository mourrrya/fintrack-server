import jwt from "jsonwebtoken";
import { UserDto } from "../dtos/userDto";
import { TokenDbOps } from "../models/tokenModel";
import { ApiError } from "../errors/apiErrors";
class TokenSer {
  generateToken(userDto: UserDto): {
    accessToken: string;
    refreshToken: string;
  } {
    try {
      const accessToken = jwt.sign(
        { ...userDto },
        process.env.JWT_ACCESS_TOKEN_SECRET as string,
        {
          expiresIn: "1h",
        }
      );
      const refreshToken = jwt.sign(
        { ...userDto },
        process.env.JWT_REFRESH_TOKEN_SECRET as string,
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

  async saveToken(userDto: UserDto, refreshToken: string, accessToken: string) {
    try {
      const tokenFound = await TokenDbOps.findTokenByUserId(userDto);

      if (tokenFound) {
        tokenFound.set({ refreshToken, accessToken });
        tokenFound.save();
        return tokenFound;
      }
      const token = await TokenDbOps.createToken(
        userDto,
        refreshToken,
        accessToken
      );
      return token;
    } catch (error) {
      throw ApiError.internal("token save failed");
    }
  }

  validateAccessToken(accessToken: string): UserDto {
    let user: UserDto = {} as UserDto;
    jwt.verify(
      accessToken,
      process.env.JWT_ACCESS_TOKEN_SECRET as string,
      (err, jwtPayload) => {
        if (err) {
          console.log("JWT Error", err);

          throw ApiError.unauthenticated(err.message);
        }
        user = jwtPayload as UserDto;
      }
    );

    return user;
  }

  validateRefreshToken(refreshToken: string) {
    let user: UserDto = {} as UserDto;
    jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_TOKEN_SECRET as string,
      (err, jwtPayload) => {
        if (err) {
          throw ApiError.unauthenticated("refresh token validation failed");
        }
        user = jwtPayload as UserDto;
      }
    );
    return user;
  }
}

export const TokenService = new TokenSer();
