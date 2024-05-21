import { UserDto } from "../dtos/userDto";

export interface IUserModel {
  id?: number;
  username: string;
  password: string;
}

export interface UserRes extends UserDto {
  accessToken: string;
  refreshToken: string;
}
