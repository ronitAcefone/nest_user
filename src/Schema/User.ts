import { MongooseModule, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";

@Schema()
export class User {
    @Prop({ default: true })
    isActive: boolean;

    @Prop({ required: true, unique: true })
    username: string;

    @Prop({ required: true })
    password: string;

    @Prop()
    email: string;

    @Prop()
    roles: [string];

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref : "User", required: true })
    createdBy: string;

    @Prop({ default: new Date() })
    createdAt: string;

    @Prop({ default: new Date() })
    modifiedAt: string;
}
export const UserSchema = SchemaFactory.createForClass(User);

export const UserModel = MongooseModule.forFeature([
    {
        name: User.name,
        schema: UserSchema
    }
]);