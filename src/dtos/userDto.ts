import { JwtPayload } from "jsonwebtoken";
import { IUserModel } from "../types/userType";
export class UserDto {
  id: number;
  username: string;

  constructor(model: IUserModel | JwtPayload) {
    this.id = model.id || 0;
    this.username = model.username;
  }
}
