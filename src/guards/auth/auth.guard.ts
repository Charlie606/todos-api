import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService){}

    async canActivate(context: ExecutionContext): Promise<boolean>{
      try{
        const request = context.switchToHttp().getRequest(); //request object
        const [type, token] = request.headers.authorization?.split(' ') ?? []; // token from header

        if(type!=='Bearer' || !token){
          throw new UnauthorizedException();
        }

        const payload = await this.jwtService.verifyAsync(token, {
          secret: process.env.JWT_SECRET,
        })

        request['payload'] = payload;
      }
      catch(err){
        throw new UnauthorizedException(err);
      }
      return true;
    }
}
