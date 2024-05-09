import { HttpException, Injectable } from '@nestjs/common';
import { AuthPayload } from './Dto/auth_payload';
import { UserDto } from './Dto/user';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/User.service';

@Injectable()
export class AuthService {
    constructor(private jwtService: JwtService, private userService: UserService) { }
    validateUser(authPayload: AuthPayload) {
        return this.userService.getUser(authPayload);
    }
    getToken(user: any) {
        return this.jwtService.sign(user);
    }
    validateToken(token: string) {
        const userDecoded = this.jwtService.decode(token);
        return userDecoded;
    }
}
