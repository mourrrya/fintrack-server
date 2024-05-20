import bcrypt from "bcrypt";
import { UserDto } from "../dtos/userDto";
import { ApiError } from "../errors/apiErrors";
import { UserDbOps } from "../models/userModel";
import { TokenService } from "./tokenServices";
import { TokenModelI } from "../interfaces/tokenInterface";

class UserSer {
  async signup(
    username: string,
    pass: string
  ): Promise<{
    user: UserDto;
    token: TokenModelI;
  }> {
    const userFound = await UserDbOps.findUserByUsername(username);
    if (userFound) {
      throw ApiError.badRequest("username is already taken");
    }

    const encryptedPass = await bcrypt.hash(pass, 10);

    const user = await UserDbOps.createUser(username, encryptedPass);

    const userDto = new UserDto(user.toJSON());

    const generatedToken = TokenService.generateToken(userDto);
    const savedToken = await TokenService.saveToken(
      userDto,
      generatedToken.refreshToken
    );
    return { user: userDto, token: savedToken.toJSON() };
  }

  async login(
    username: string,
    pass: string
  ): Promise<{
    user: UserDto;
    token: TokenModelI;
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
    const generatedToken = TokenService.generateToken(userDto);
    const savedToken = await TokenService.saveToken(
      userDto,
      generatedToken.refreshToken
    );
    return { user: userDto, token: savedToken.toJSON() };
  }
}

export const UserService = new UserSer();
