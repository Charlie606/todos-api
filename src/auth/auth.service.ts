// import { Injectable } from '@nestjs/common';
// import { PrismaClient } from '@prisma/client';
// import { UsersService } from 'src/users/users.service';
// import { RegisterDto } from './dto/register.dto';
// import { JwtService } from '@nestjs/jwt';

// @Injectable()
// export class AuthService {
//   constructor(
//     private readonly prisma: PrismaClient,
//     private readonly userService: UsersService,
//     private readonly jwtService: JwtService,
//   ) {}

//   async register(registerDto: RegisterDto) {
//     const user = await this.userService.create(registerDto);
//     const token =await  this.jwtService.signAsync(user);
//     return {token};
//   }

  
// }

import { Injectable, NotFoundException, UnauthorizedException,} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { UsersService } from 'src/users/users.service';
import { RegisterDto } from './dto/register.dto';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { compare } from 'bcrypt';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class AuthService {
  constructor( 
    private readonly prisma: PrismaClient, 
    private readonly usersService: UsersService, 
    private readonly jwtService: JwtService, 
    private readonly mail: MailerService,
  ) {}

  async register(registerDto: RegisterDto) {
    const user = await this.usersService.create(registerDto);
    await this.sendVerificationMail({
      data: {
        from: 'test@example.com',
        to: 'test@test.com',
        otp: 123456,
      }
    });
    const token = await this.jwtService.signAsync(user);
    return { token };
  }

  async login(loginDto: LoginDto) {
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [
          {
            email: loginDto.username,
          },
          {
            mobile: loginDto.username,
          },
        ],
      },
    });

    if (!user) {
      throw new NotFoundException('Unable to find the user');
    }

    const isPasswordValid = await compare(loginDto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = await this.jwtService.signAsync(user);
    return { token };
  }

  async profile(user_id: number){
    return this.usersService.findOne(user_id);
  }

  async updateProfile(user_id:number, updateProfileDto: UpdateProfileDto) {
    return this.usersService.update(user_id, updateProfileDto);
  }

  async sendVerificationMail(job: any) {
    const { data } = job;

    try {
      await this.mail.sendMail({
        ...data,
        subject: 'Verify Your Email',
        template: 'verify-emial',
        constext: {
          otp: data.otp,
        },
      })
    }catch(e) {
      console.log(e)
    }
  }
}
