import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './Dto/create_user.dto';
import mongoose, { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/Schema/User';
import { UpdateUserDto } from './Dto/update_user.dto';
import { DB } from 'src/MongoDb/functions';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}
  async getUser(cond: any) {
    try {
      let condition = { ...cond, isActive: true };
      return await DB.getSingleData(
        this.userModel,
        condition,
        {
          username: 1,
          email: 1,
          createdBy: 1,
          roles: 1,
        },
        [{ path: 'createdBy', select: { username: 1, email: 1 } }],
      );
    } catch (error) {
      throw new HttpException(
        error?.message ? error.message : 'Error while getting user',
        error?.status ? error.status : HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  async getUserCount(condition: any) {
    try {
      return await DB.getCount(
        this.userModel,
        { ...condition, isActive: true }
      );
    } catch (error) {
      throw new HttpException(
        error?.message ? error.message : 'Error while getting user list',
        error?.status ? error.status : HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  async getUserList(condition: any, skip: number = 0, limit: number = 10) {
    try {
      return await DB.getData(
        this.userModel,
        { ...condition, isActive: true },
        { username: 1, email: 1, createdBy: 1, roles: 1 },
        skip,
        limit,
        [{ path: 'createdBy', select: { username: 1, email: 1 } }],
      );
    } catch (error) {
      throw new HttpException(
        error?.message ? error.message : 'Error while getting user list',
        error?.status ? error.status : HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  async createUser(userDto: CreateUserDto, createdById: string) {
    try {
      return await DB.saveData(this.userModel, {
        ...userDto,
        isActive: true,
        createdAt: new Date(),
        createdBy: createdById,
      });
      
    } catch (error) {
      throw new HttpException(
        error?.message ? error.message : 'Error while creating user',
        error?.status ? error.status : HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateUser(id: string, userDto: UpdateUserDto) {
    try {
      return await DB.updateById(
        this.userModel,
        new Types.ObjectId(id),
        { ...userDto, modifiedAt: new Date() },
      );
      
    } catch (error) {
      throw new HttpException(
        error?.message ? error.message : 'Error while updating user',
        error?.status ? error.status : HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteUser(id: string) {
    try {
      await DB.updateById(this.userModel, new Types.ObjectId(id), {
        isActive: false,
        modifiedAt: new Date(),
      });
    } catch (error) {
      throw new HttpException(
        error?.message ? error.message : 'Error while deleting user',
        error?.status ? error.status : HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
