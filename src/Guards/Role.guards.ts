import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Request } from "express";
import { Observable } from "rxjs";
import { Roles } from "src/Decorators/Roles";


@Injectable()
export class RoleGuard implements CanActivate {
    constructor(private reflectors: Reflector) {

    }
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const req = context.switchToHttp().getRequest<Request>();
        if (!req["user"] || !req["user"].roles) {
            return false;
        }
        const allowedRoles = this.reflectors.get(Roles, context.getHandler());
        const map = {}
        for (let role of req["user"].roles) {
            map[role] = 1;
        }
        for (let role of allowedRoles) {
            if (!map[role]) return false;
        }
        return true;
    }
}