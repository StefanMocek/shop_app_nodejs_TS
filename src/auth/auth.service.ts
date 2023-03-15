import {AuthDto} from "./dtos/auth.dto";
import {UserService, userService} from "./user/user.service";
import {AuthenticationService} from "@shop-app-package/common";


export class AuthService {
  constructor (
    public userService: UserService,
    public authenticationService: AuthenticationService 
  ) {}

  async signup (createUserDto: AuthDto) {
    const existingUser = await this.userService.findOneByEmail(createUserDto.email);
    if (existingUser) {
      return {message: 'Email already taken'}
    };
    const newUser = await this.userService.create(createUserDto);

    const jwt = this.authenticationService.generateJwt({email: createUserDto.email, userId: newUser.id}, process.env.JWT_KEY!)
    return {jwt};
  };

  async signin(signInDto:AuthDto) {
    const user = await this.userService.findOneByEmail(signInDto.email);
    if (!user) {
      return {message: 'Wrong credentials'}
    };

    const pwdCompered = this.authenticationService.pwdCompare(user.password, signInDto.password);

    if (!pwdCompered) {
      return {message: 'Wrong credentials'}
    };

    const jwt = this.authenticationService.generateJwt({email: user.email, userId: user.id}, process.env.JWT_KEY!)
    return {jwt};  
  }
}
export const authService = new AuthService(userService, new AuthenticationService());