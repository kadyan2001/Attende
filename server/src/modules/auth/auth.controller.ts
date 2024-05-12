import {
  Controller,
  Post,
  UseGuards,
  Get,
  Req,
  Res,
  HttpStatus,
  Body,
  Put,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt.guard';
import { AuthenticateDto } from './dto/authenticate.dto';
import { Roles } from './roles/roles.decorator';
import { RolesGuard } from './roles/roles.guard';
import { SignupDto } from './dto/signup.dto';
import { Role } from './interface/user.interface';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('login')
  async login(@Res() res, @Body() authenticateDto: AuthenticateDto) {
    try {
      const response = await this.authService.login(authenticateDto);
      return res.status(HttpStatus.OK).json({ response });
    } catch (error) {
      return res.status(error.status).json(error.response);
    }
  }

  @Post('signup')
  async signup(@Res() res, @Body() signupDto: SignupDto) {
    try {
      const response = await this.authService.signup(signupDto);
      return res.status(HttpStatus.OK).json({ response });
    } catch (error) {
      return res.status(error.status).json(error.response);
    }
  }

  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Put('update')
  async updateCredentials(
    @Req() req,
    @Res() res,
    @Body() signupDto: SignupDto,
  ) {
    try {
      const response = await this.authService.updateCredentials(
        req.query._id,
        signupDto,
      );
      return res.status(HttpStatus.OK).json({ response });
    } catch (error) {
      return res.status(error.status).json(error.response);
    }
  }

  @Roles(Role.Admin, Role.User)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('get')
  getProfile(@Req() req: any, @Res() res) {
    return res.status(HttpStatus.OK).json(req.user);
  }

  @Roles(Role.Admin, Role.User)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('get-profiles')
  getProfiles(@Req() req: any) {
    if (req.user.role !== 'admin') {
      return this.authService.getProfiles(req.user._id);
    } else {
      return this.authService.getProfiles();
    }
  }
}
