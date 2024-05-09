import { HttpException, Injectable, NestMiddleware } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { NextFunction, Request, Response } from "express";

@Injectable()
export class TokenValidator implements NestMiddleware {
    constructor(private jwtService: JwtService) {

    }
    use(req: Request, res: Response, next: NextFunction) {
        if (!req.headers.token) {
            throw new HttpException("Login required", 400);
        }
        const decoded = this.jwtService.decode(req.headers.token.toString());
        // const current = new Date().getTime();
        // console.log("---------->", decoded, current)
        // if(current > decoded.exp) throw new HttpException("Token expired. Please login again.", 400);
        req["user"] = decoded;
        next();
    }
}