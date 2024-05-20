import bcrypt from "bcrypt";
import { UserDto } from "../dtos/userDto";
import { ApiError } from "../errors/apiErrors";
import { UserDbOps } from "../models/userModel";
import { ITokenModel } from "../types/tokenType";
import { TokenService } from "./tokenServices";

class UserSer {
  async signup(
    username: string,
    pass: string
  ): Promise<{
    user: UserDto;
    token: ITokenModel;
  }> {
    const userFound = await UserDbOps.findUserByUsername(username);
    if (userFound) {
      throw ApiError.badRequest("username is already taken");
    }

    const encryptedPass = await bcrypt.hash(pass, 10);

    const user = await UserDbOps.createUser(username, encryptedPass);

    const userDto = new UserDto(user.toJSON());

    const { accessToken, refreshToken } = TokenService.generateToken(userDto);
    const savedToken = await TokenService.saveToken(
      userDto,
      refreshToken,
      accessToken
    );
    return { user: userDto, token: savedToken.toJSON() };
  }

  async login(
    username: string,
    pass: string
  ): Promise<{
    user: UserDto;
    token: ITokenModel;
  }> {
    const user = await UserDbOps.findUserByUsername(username);

    if (!user) {
      throw ApiError.badRequest("User not found");
    }

    const isPassMatched = bcrypt.compareSync(
      pass,
      user.getDataValue("password")
    );

    if (!isPassMatched) {
      throw ApiError.badRequest("Invalid password");
    }

    const userDto = new UserDto(user.toJSON());
    const { accessToken, refreshToken } = TokenService.generateToken(userDto);
    const savedToken = await TokenService.saveToken(
      userDto,
      refreshToken,
      accessToken
    );
    return { user: userDto, token: savedToken.toJSON() };
  }
}

export const UserService = new UserSer();
