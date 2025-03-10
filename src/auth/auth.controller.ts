import { Body, Controller, Get, Param, Post, Res } from '@nestjs/common';
import { AuthService } from './providers/auth.service';
import { SignInDto } from './dtos/signin.dto';
import { Auth } from './decorators/auth.decorator';
import { AuthType } from './enums/auth-type.enum';
import { RefreshToken } from './dtos/refreshToken.dto';
import { ChangePasswordDto } from './dtos/changePassword.dto';
import { ActiveUser } from './decorators/active-user.decorator';
import { ActiveUserData } from './interface/active-user-data.interface';
import { Roles } from './decorators/roles.decorator';
import { Userroles } from './enums/userroles.enum';
import { SignupDto } from './dtos/signup.dto';
import { Response } from 'express';

@Controller('auth')
@Auth(AuthType.None)
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Auth(AuthType.None)
  @Roles(...Object.values(Userroles))
  @Post('sign-in')
  public async signin(@Body() signInDto: SignInDto, @Res() res: Response) {
    const token = await this.authService.signIn(signInDto);
    res.cookie('token', token.tokens.accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.cookie('refresh-token', token.tokens.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000,
    });
    return res.json({ message: 'Sign-in successful' });
  }
  @Auth(AuthType.None)
  @Roles(...Object.values(Userroles))
  @Post('refresh-token')
  public async refreshToken(@Body() refreshToken: RefreshToken) {
    return this.authService.refreshTokens(refreshToken);
  }
  @Auth(AuthType.Bearer)
  @Roles(...Object.values(Userroles))
  @Post('change-password')
  public async changePassword(@Body() newPassword: ChangePasswordDto) {
    return this.authService.changePassword(newPassword);
  }
  @Get('/validate')
  @Roles(...Object.values(Userroles))
  @Auth(AuthType.Bearer)
  public validaterRoute(@ActiveUser() user: ActiveUserData) {
    return user;
  }
  @Post('sign-up')
  @Roles(Userroles.SUPERUSER, Userroles.HR, Userroles.ADMIN)
  public async Signup(@Body() SignupDto: SignupDto) {
    return this.authService.signUpMembers(SignupDto);
  }
}
