import { IUserModel } from "../types/userType";
export class UserDto {
  id: number;
  username: string;

  constructor(model: IUserModel) {
    this.id = model.id || 0;
    this.username = model.username;
  }
}
