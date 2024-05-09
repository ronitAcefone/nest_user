import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './Auth/auth.module';
import { UserModule } from './user/User.module';
import { TokenValidator } from './Middleware/token_validator.middleware';
import { UserController } from './user/User.controller';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [AuthModule, UserModule, MongooseModule.forRoot(process.env.MONGO_URI)],
  controllers: [AppController],
  providers: [AppService, JwtService],
})
export class AppModule {
  configure(consumer : MiddlewareConsumer){
    consumer.apply(TokenValidator).forRoutes(UserController);
  }
}
