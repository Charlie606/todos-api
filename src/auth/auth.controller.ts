import { Body, Controller, Get, Post, Req, Patch } from '@nestjs/common';
import { AuthService } from './auth.service';
import { register } from 'module';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Public } from 'src/helper/public';

import { UpdateProfileDto } from './dto/update-profile.dto';
import { Payload } from 'src/interfaces/payload';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  
  @Public()
  @Post('register')
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Public()
  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Get('profile')
  profile(@Req() req: Payload){
    return this.authService.profile(req.payload.user_id);
  }

  @Patch('profile')
  updateProfile(@Req() req: Payload, @Body() updateProfile: UpdateProfileDto){
    return this.authService.updateProfile(req.payload.user_id, updateProfile);
  }
}
