import {
  HttpException,
  HttpStatus,
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class TokenValidator implements NestMiddleware {
  constructor(private jwtService: JwtService) {}
  use(req: Request, res: Response, next: NextFunction) {
    try {
        if (!req.headers.token) {
          throw new HttpException('Token required', HttpStatus.UNAUTHORIZED);
        }
        let decoded;
        try {
          decoded = this.jwtService.verify(req.headers.token.toString(), {
            secret: process.env.SECRET_KEY,
          });
        } catch (error) {
          throw new UnauthorizedException("Token expired, login again.");
        }
        req['user'] = decoded;
        next();
    } catch (error) {
        throw new HttpException(error?.message ? error.message : "Error while validating token", error?.status ? error.status : HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
