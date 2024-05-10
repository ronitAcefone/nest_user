import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Paramtype,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './User.service';
import { CreateUserDto } from './Dto/create_user.dto';
import { RoleGuard } from 'src/Guards/Role.guards';
import { Roles } from 'src/Decorators/Roles';
import { Request } from 'express';
import { UpdateUserDto } from './Dto/update_user.dto';
import mongoose from 'mongoose';
import { AutherizationTypes } from 'src/Common/Constants';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}
  @Get('/list')
  userList(@Req() req: Request) {
    try {
      return this.userService.getUserList({ createdBy: req['user']._id });
    } catch (error) {
      throw new HttpException(
        error?.message ? error.message : 'Error while getting user',
        error?.status ? error.status : 500,
      );
    }
  }

  @Post('')
  @Roles([AutherizationTypes.USER_ADD])
  @UseGuards(RoleGuard)
  async createUser(@Req() req: Request, @Body() createUserDto: CreateUserDto) {
    try {
      const foundUser = await this.userService.getUser({username : createUserDto.username});
      if(foundUser) throw new HttpException("username already exists", HttpStatus.BAD_REQUEST)
      return this.userService.createUser(createUserDto, req['user']._id);
    } catch (error) {
      throw new HttpException(
        error?.message ? error.message : 'Error while creating user',
        error?.status ? error.status : 500,
      );
    }
  }

  @Post(':id')
  @Roles([AutherizationTypes.USER_UPDATE])
  @UseGuards(RoleGuard)
  async updateUser(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    try {
      const isValid = mongoose.Types.ObjectId.isValid(id);
      if (!isValid) throw new HttpException('Invalid user id', 400);
      const foundUser = await this.userService.getUser({
        _id: id,
        createdBy: req['user']._id,
      });
      if (!foundUser) throw new HttpException('User not found', 404);
      return this.userService.updateUser(id, updateUserDto);
    } catch (error) {
      throw new HttpException(
        error?.message ? error.message : 'Error while updating user',
        error?.status ? error.status : 500,
      );
    }
  }

  @Post('delete/:id')
  @Roles([AutherizationTypes.USER_DELETE])
  @UseGuards(RoleGuard)
  async deleteUser(@Req() req: Request, @Param('id') id: string) {
    try {
      const isValid = mongoose.Types.ObjectId.isValid(id);
      if (!isValid) throw new HttpException('Invalid user id', 400);
      const foundUser = await this.userService.getUser({
        _id: id,
        createdBy: req['user']._id,
      });
      if (!foundUser) throw new HttpException('User not found', 404);
      return this.userService.deleteUser(id);
    } catch (error) {
      throw new HttpException(
        error?.message ? error.message : 'Error while delete user',
        error?.status ? error.status : 500,
      );
    }
  }
}
