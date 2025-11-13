import { SaleModel } from "../models/Sale";
import { ProductModel } from "../models/Product";
import { ClientModel } from "../models/Client";

export const getAllSales = async () => {
    const sales = await SaleModel.find({deleted: false}).lean()
    return sales
}

export const getAllSalesByDate = async (from: Date, to: Date) => {
    const sales = await SaleModel.find({date: { $gte: from, $lte: to }, deleted: false}).lean();
    return sales
};

export const getSaleById = async (id: string) => {
    const sale = await SaleModel.findById(id).lean()
    return sale
}

export const getSalesByClientName = async (name: string) => {
    return await SaleModel.find({
        "client.name": { $regex: name, $options: "i" } // i => No importa mayus/minus
    });
};

export const createSale = async (data: any) => {
    for (const product of data.products) {
        const productInDB = await ProductModel.findOne({_id: product._id, active: true});

        if (!productInDB) {
            throw new Error(`Product with ID ${product._id} does not exist or its deleted.`);
        }

        if (productInDB.stock < product.amount) {
            throw new Error(`Insufficient stock for product "${productInDB.name}". Available: ${productInDB.stock}, requested: ${product.amount}`);
        } else {
            await ProductModel.findByIdAndUpdate(product._id, { $inc: { stock: -product.amount } });
        }
    }

    const clientInDB = await ClientModel.findById(data.client._id, {isDeleted: false})

    if (!clientInDB){
        throw new Error(`Client with ID ${data.client._id} does not exist or its deleted.`);
    }

    const products = data.products.map((p: any) => ({
        ...p,
        subtotal: p.amount * p.price
    }));

    const total = products.reduce((sum: number, p: any) => sum + p.subtotal, 0);

    const newSale = await SaleModel.create({...data, products, total});

    return newSale;
};

export const deletedSaleById = async (id: string) => {
    const deletedSale = await SaleModel.findById(id, {deleted: false})

    if (!deletedSale){
        throw new Error(`Sale with ID ${id} does not exist or its deleted.`);
    }

    for (const product of deletedSale.products){
        await ProductModel.findByIdAndUpdate(product._id, { $inc: { stock: +product.amount } });
    }

    await SaleModel.findByIdAndUpdate(id, {deleted: true})

    return deletedSale
}