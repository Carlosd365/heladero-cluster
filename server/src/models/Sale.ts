import { prop, getModelForClass } from "@typegoose/typegoose";

class ClientSale {
    @prop({ required: true })
    _id: string;

    @prop({ required: true })
    name: string;
}

class ProductSale {
    @prop({ required: true })
    _id: string;

    @prop({ required: true })
    name: string;

    @prop({ required: true })
    amount: number;

    @prop({ required: true })
    price: number;

    @prop({ required: true })
    subtotal: number;
}

export class Sale {
    @prop({ required: true, type: () => ClientSale })
    client: ClientSale;

    @prop({ default: Date.now })
    date: Date;

    @prop({ required: true })
    payment_method: string;

    @prop({ required: true })
    total: number;

    @prop({ type: () => [ProductSale] })
    products: ProductSale[];

    @prop({type: Boolean, default: false})
    deleted: boolean
}

export const SaleModel = getModelForClass(Sale);
