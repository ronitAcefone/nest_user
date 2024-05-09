import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class CreateUserDto {

    isActive : boolean;
    
    @IsString()
    @IsNotEmpty()
    username: string;

    @IsEmail()
    email: string;

    roles : [string];

    @IsString()
    @IsNotEmpty()
    password: string;
}