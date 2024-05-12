import {
  ConflictException,
  Injectable,
  NotAcceptableException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { AuthenticateDto } from './dto/authenticate.dto';
import { SignupDto } from './dto/signup.dto';
import { Role } from './interface/user.interface';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(user_id: string, password: string): Promise<any> {
    const user = await this.userService.findByUserId(user_id);
    if (!user) return null;
    const passwordValid = await bcrypt.compare(password, user.password);
    if (!user) {
      throw new NotAcceptableException('could not find the user');
    }
    if (user && passwordValid) {
      return user;
    }
    throw new UnauthorizedException();
  }

  async login(authenticateDto: AuthenticateDto) {
    let identifier;
    if (authenticateDto.user_id) {
      identifier = authenticateDto.user_id;
    }
    const userInfo: any = await this.userService.findByUserId(identifier);
    if (!userInfo) {
      throw new NotFoundException('Invalid credentials');
    }
    const passwordValid = await bcrypt.compare(
      authenticateDto.password,
      userInfo.password,
    );
    if (userInfo && passwordValid) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...restUser } = userInfo;
      const token = await this.jwtService.signAsync({ ...restUser });
      return { token, user: restUser };
    }
    throw new UnauthorizedException();
  }

  async updateCredentials(_id: string, signupDto: SignupDto) {
    const updatedUser = await this.userService.updateCredentials(
      _id,
      signupDto,
    );
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...restUser } = updatedUser;
    const token = await this.jwtService.signAsync({ ...restUser });
    return { token, user: restUser };
  }

  async signup(signupDto: SignupDto) {
    let identifier;
    if (signupDto.user_id) {
      identifier = signupDto.user_id;
    }
    let adminInfo: any = await this.userService.findByUserId(identifier);
    if (adminInfo) {
      throw new ConflictException(
        `${signupDto.role === Role.Admin ? 'Admin' : 'User'} already exists`,
      );
    }
    adminInfo = await this.userService.signup(signupDto);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...restUser } = adminInfo?._doc;
    const token = await this.jwtService.signAsync({ ...restUser });
    return { token, user: restUser };
  }

  getProfiles(_id?: string) {
    return this.userService.getProfiles(_id);
  }
}
