import {NextFunction} from "express";
import {CreateUserDto} from "./dtos/auth.dto";
import {UserService, userService} from "./user/user.service";
import {BadRequestError, AuthenticationService} from "@shop-app-package/common";


export class AuthService {
  constructor (
    public userService: UserService,
    public authenticationService: AuthenticationService 
  ) {}

  async signup (createUserDto: CreateUserDto, errCallback: NextFunction) {
    const existingUser = await this.userService.findOneByEmail(createUserDto.email);
    if (existingUser) {
      return errCallback(new BadRequestError('User with the same email already exists'))
    };
    const newUser = await this.userService.create(createUserDto);

    const jwt = this.authenticationService.generateJwt({email: createUserDto.email, userId: newUser.id}, process.env.JWT_KEY!)
    return jwt;
  }
}
export const authService = new AuthService(userService, new AuthenticationService());