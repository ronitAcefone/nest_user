import { Module } from '@nestjs/common';
import { UserController } from './User.controller';
import { UserService } from './User.service';
import { UserModel, } from 'src/Schema/User';

@Module({
  imports: [
    UserModel
  ],
  controllers: [UserController],
  providers: [UserService]
})
export class UserModule { }
