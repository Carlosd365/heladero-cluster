import { prop, getModelForClass } from "@typegoose/typegoose";

export class Client {
    @prop({ required: true })
    name: string

    @prop({ required: true })
    email: string;

    @prop({ required: true })
    phoneNumber: string;

    @prop({ type: Boolean, default: false })
    isDeleted: boolean;
}

export const ClientModel = getModelForClass(Client);