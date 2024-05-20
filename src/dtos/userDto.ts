import { UserModelI } from "../interfaces/userInterface";

export class UserDto {
  id: number;
  userName: string;

  constructor(model: UserModelI) {
    this.id = model.id || 0;
    this.userName = model.username;
  }
}
