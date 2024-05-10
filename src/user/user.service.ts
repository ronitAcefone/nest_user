import { HttpException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './Dto/create_user.dto';
import { Model } from 'mongoose';
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
        error?.status ? error.status : 500,
      );
    }
  }
  async getUserList(condition: any) {
    try {
      const data = await DB.getData(
        this.userModel,
        { ...condition, isActive: true },
        { username: 1, email: 1, createdBy: 1 },
        [{ path: 'createdBy', select: { username: 1, email: 1 } }],
      );
      return {
        success: true,
        data,
      };
    } catch (error) {
      throw new HttpException(
        error?.message ? error.message : 'Error while getting user list',
        error?.status ? error.status : 500,
      );
    }
  }
  async createUser(userDto: CreateUserDto, createdById: string) {
    try {
      let newUser = new this.userModel({
        ...userDto,
        isActive: true,
        createdAt: new Date(),
        createdBy: createdById,
      });
      const savedUser = await newUser.save();
      return {
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

  async updateUser(id: string, userDto: UpdateUserDto) {
    try {
      const updatedUser = await this.userModel.findByIdAndUpdate(
        id,
        { $set: { ...userDto, modifiedAt: new Date() } },
        { new: true },
      );
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

  async deleteUser(id: string) {
    try {
      await this.userModel.findByIdAndUpdate(
        id,
        { $set: { isActive: false, modifiedAt: new Date() } },
        { new: true },
      );
      return {
        success: true,
        message: 'User deleted successfully',
      };
    } catch (error) {
      throw new HttpException(
        error?.message ? error.message : 'Error while deleting user',
        error?.status ? error.status : 500,
      );
    }
  }
}
