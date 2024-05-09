import { IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class UpdateUserDto {

    @IsOptional()
    isActive : boolean;

    @IsEmail()
    @IsOptional()
    email: string;

    @IsOptional()
    roles : [string];

    @IsString()
    @IsOptional()
    password: string;
}