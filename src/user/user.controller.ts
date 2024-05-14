import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Paramtype,
  Post,
  Query,
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
  async userList(@Req() req: Request, @Query() query: any) {
    try {
      let count = await this.userService.getUserCount({
        isActive: true,
        createdBy: req['user']._id,
      });
      let data = await this.userService.getUserList(
        { createdBy: req['user']._id },
        !isNaN(query.skip) ? parseInt(query.skip) : 0,
        !isNaN(query.limit) ? parseInt(query.limit) : 0,
      );

      return {
        success: true,
        count,
        data,
      };
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
      const foundUser = await this.userService.getUser({
        username: createUserDto.username,
      });
      if (foundUser)
        throw new HttpException(
          'username already exists',
          HttpStatus.BAD_REQUEST,
        );
      const savedUser = await this.userService.createUser(
        createUserDto,
        req['user']._id,
      );
      return {
        statusCode: HttpStatus.CREATED,
        success: true,
        data: savedUser,
        message: 'User created successfully',
      };
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
      const updatedUser = await this.userService.updateUser(id, updateUserDto);
      return {
        success: true,
        data: updatedUser,
        message: 'User updated successfully',
      };
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
      await this.userService.deleteUser(id);
      return {
        success: true,
        message: 'User deleted successfully',
      };
    } catch (error) {
      throw new HttpException(
        error?.message ? error.message : 'Error while delete user',
        error?.status ? error.status : 500,
      );
    }
  }
}
