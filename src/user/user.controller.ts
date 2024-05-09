import { Body, Controller, Get, HttpException, Param, Paramtype, Post, Req, UseGuards } from '@nestjs/common';
import { UserService } from './User.service';
import { CreateUserDto } from './Dto/create_user.dto';
import { RoleGuard } from 'src/Guards/Role.guards';
import { Roles } from 'src/Decorators/Roles';
import { Request } from 'express';
import { UpdateUserDto } from './Dto/update_user.dto';
import mongoose from 'mongoose';

@Controller('user')
export class UserController {
    constructor(private userService: UserService) { }
    @Get("/list")
    userList(@Req() req: Request) {
        return this.userService.getUserList({createdBy : req["user"]._id});
    }

    @Post("")
    @Roles(["USER_ADD"])
    @UseGuards(RoleGuard)
    createUser(@Req() req: Request, @Body() createUserDto: CreateUserDto) {
        return this.userService.createUser(createUserDto, req["user"]._id);
    }
    
    @Post(":id")
    @Roles(["USER_UPDATE"])
    @UseGuards(RoleGuard)
    async updateUser(@Req() req: Request,@Param("id") id: string, @Body() updateUserDto: UpdateUserDto) {
        const isValid = mongoose.Types.ObjectId.isValid(id);
        if(!isValid) throw new HttpException("Invalid user id", 400);
        const foundUser = await this.userService.getUser({_id : id, createdBy : req["user"]._id});
        if(!foundUser) throw new HttpException("User not found", 404);
        return this.userService.updateUser(id , updateUserDto);
    }

    @Post("delete/:id")
    @Roles(["USER_DELETE"])
    @UseGuards(RoleGuard)
    async deleteUser(@Req() req: Request,@Param("id") id: string) {
        const isValid = mongoose.Types.ObjectId.isValid(id);
        if(!isValid) throw new HttpException("Invalid user id", 400);
        const foundUser = await this.userService.getUser({_id : id, createdBy : req["user"]._id});
        if(!foundUser) throw new HttpException("User not found", 404);
        return this.userService.deleteUser(id);
    }

}
