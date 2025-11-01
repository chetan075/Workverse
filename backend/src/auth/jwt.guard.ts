import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwt: JwtService) {}

  async canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();
    const cookieName = process.env.COOKIE_NAME ?? 'jid';
    const authHeader: string | undefined = req.headers?.authorization;
    let token: string | undefined = undefined;
    if (authHeader && authHeader.startsWith('Bearer ')) token = authHeader.split(' ')[1];
    else if (req.cookies && req.cookies[cookieName]) token = req.cookies[cookieName];

    if (!token) throw new UnauthorizedException('Missing token');
    try {
      const payload = this.jwt.verify(token, { secret: process.env.JWT_SECRET ?? 'dev' });
      // attach payload to request for controllers
      req.user = payload;
      return true;
    } catch (err) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
