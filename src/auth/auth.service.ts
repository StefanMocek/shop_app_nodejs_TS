import {NextFunction} from "express";
import {CreateUserDto} from "./dtos/auth.dto";
import {UserService, userService} from "./user/user.service";
import {BadRequestError} from "@shop-app-package/common";


export class AuthService {
  constructor (
    public userService: UserService
  ) {}

  async signup (createUserDto: CreateUserDto, errCallback: NextFunction) {
    const existingUser = await this.userService.findOneByEmail(createUserDto.email);
    if (existingUser) {
      return errCallback(new BadRequestError('User with the same email already exists'))
    };
    const newuser = await this.userService.create(createUserDto)
  }
}
export const authService = new AuthService(userService);