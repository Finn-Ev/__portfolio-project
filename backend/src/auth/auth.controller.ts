import { Body, Controller, Get, HttpCode, HttpStatus, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  register(@Body() dto: AuthDto, @Res({ passthrough: true }) response) {
    return this.authService.register(dto, response);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() dto: AuthDto, @Res({ passthrough: true }) response) {
    return this.authService.login(dto, response);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Res({ passthrough: true }) response) {
    this.authService.logout(response);
  }
}
