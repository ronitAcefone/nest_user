import { Injectable } from '@nestjs/common';
import { GetUserDto } from './Dto/get_user.dto';
import { CreateUserDto } from './Dto/create_user.dto';
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { User } from 'src/Schema/User';
import { UpdateUserDto } from './Dto/update_user.dto';


const users: any = [
    {
        _id: "1",
        isActive: true,
        type: 0, // 0 = admin , 1 = user
        username: "admin",
        password: "admin",
    },
    {
        _id: "2",
        isActive: false,
        type: 0,
        username: "admin",
        password: "admin",
    },
    {
        _id: "3",
        isActive: true,
        type: 1,
        username: "user1",
        password: "pass",
    },
]
@Injectable()
export class UserService {
    constructor(@InjectModel(User.name) private userModel: Model<User>) {

    }
    getUser(cond: any) {
        let condition = { ...cond, isActive: true, };
        console.log("condition : ", condition);
        return this.userModel.findOne(condition, { username: 1, email: 1, createdBy: 1 , roles: 1}).lean();
    }
    async getUserList(condition :any) {
        const data = await this.userModel.find({...condition , isActive: true});
        return {
            success: true,
            data,
        }
    }
    async createUser(userDto: CreateUserDto, createdById : string) {
        let newUser = new this.userModel({ ...userDto, isActive: true, createdAt: new Date(), createdBy: createdById });
        const savedUser = await newUser.save();
        return {
            success: true,
            data : savedUser,
            message : "User created successfully",
        }
    }

    async updateUser(id: string, userDto: UpdateUserDto){
        const updatedUser = await this.userModel.findByIdAndUpdate(id, {$set : {...userDto, modifiedAt : new Date()}}, { new : true});
        return {
            success: true,
            data : updatedUser,
            message : "User updated successfully",
        }
    }

    async deleteUser(id: string){
         await this.userModel.findByIdAndUpdate(id, {$set : {isActive: false, modifiedAt: new Date()}}, { new : true});
         return {
            success: true,
            message : "User deleted successfully",
         }
    }
}
