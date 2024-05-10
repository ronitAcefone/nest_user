import { Body, Controller, Get, HttpException, Post, ValidationPipe } from "@nestjs/common";
import { AuthPayload } from "./Dto/auth_payload";
import { AuthService } from "./auth.service";
// import jwT from "jsonwebtoken";


@Controller("auth")
export class AuthController {
    constructor(private authService: AuthService) {

    }

    @Post("login")
    async login(@Body() authPayload: AuthPayload) {
        const foundUser = await this.authService.validateUser(authPayload);
        if (!foundUser) throw new HttpException("Invalid username or password", 400);
        const token = this.authService.getToken(foundUser);
        return {
            message: "Welcome, enjoy your token",
            token,
        }
    }
}