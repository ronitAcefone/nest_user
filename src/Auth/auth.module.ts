import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from './auth.service';
import { JwtModule } from "@nestjs/jwt";
import { UserService } from "src/user/User.service";
import { UserModel } from "src/Schema/User";
import { ConfigModule } from "@nestjs/config";

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath : ".env",
            isGlobal: true,
        }),
        JwtModule.register({
            secret: process.env.SECRET_KEY,
            signOptions: {
                expiresIn: "24h"
            }
        }),
        UserModel
    ],
    controllers: [AuthController],
    providers: [AuthService, UserService]
})
export class AuthModule { }