import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";

import { ROLES_KEY } from "./roles-auth.decorator";

@Injectable()
export class RolesGuard implements CanActivate{
  constructor(private jwtService: JwtService, private reflector: Reflector) {
  }
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    try {
      const requiredRoles =this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
        context.getHandler(),
        context.getClass()
      ]);

      if(!requiredRoles) {
        return true;
      }
      const req = context.switchToHttp().getRequest();
      const authHeaders = req.headers.authorization;
      const bearer = authHeaders.split(' ')[0]
      const token = authHeaders.split(' ')[1]

      if(bearer !== 'Bearer' || !token) {
        throw new UnauthorizedException({
          message: "User isn't authorized"
        })
      }

      const user = this.jwtService.verify(token);

      req.user = user;

      return user.roles.some(role => requiredRoles.includes(role.value));
    } catch (e) {
      console.log(e);
      throw new HttpException("Dont have access", HttpStatus.FORBIDDEN)
    }
  }

}
