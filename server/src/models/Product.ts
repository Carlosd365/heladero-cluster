import { prop, getModelForClass } from "@typegoose/typegoose";

export class Product {
    @prop({required: true})
    name: string

    @prop({required: true, min: 0})
    price: number

    @prop({required: true, min: 0})
    stock: number

    @prop({type: Boolean, required: true, default: true})
    active: boolean
}

export const ProductModel = getModelForClass(Product)
